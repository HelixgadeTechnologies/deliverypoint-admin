"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { collection, getDocs, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { WithdrawalRequest } from "@/types/withdrawal";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import InfoAlert from "@/ui/info-alert";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import ViewDetails from "@/ui/table-action";
import UserDetailsModal from "@/components/withdrawals/user-details-modal";
import { toast, Toaster } from "react-hot-toast";
import { generateRef } from "@/lib/services/paystackService";
import { getBankCodeAction, createTransferRecipientAction, initiateWithdrawalAction } from "@/lib/actions/paystackActions";

export default function Withdrawals() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [viewUserDetails, setViewUserDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [stats, setStats] = useState([
    { title: "Total Requests", amount: "0", icon: "solar:wallet-outline", iconBg: "#0095DA", percent: 0 },
    { title: "Pending", amount: "0", icon: "tdesign:time", iconBg: "#FFAC33", percent: 0 },
    { title: "Approved", amount: "0", icon: "prime:check-circle", iconBg: "#21C788", percent: 0 },
    { title: "Declined", amount: "0", icon: "gg:close-o", iconBg: "#FF4D4F", percent: 0 },
  ]);

  const withdrawalHead = ["Name", "User Type", "Wallet Balance", "Last Payout", "Withdrawal", "Status", "Actions"];

  // Fetch withdrawal requests
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        const withdrawalsRef = collection(db, "withdrawalRequest");
        const snapshot = await getDocs(withdrawalsRef);

        let total = 0;
        let pending = 0;
        let approved = 0;
        let declined = 0;

        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          total++;

          if (d.status === "Pending") pending++;
          else if (d.status === "Approved") approved++;
          else if (d.status === "Declined") declined++;

          return {
            id: doc.id,
            ...d,
          } as WithdrawalRequest;
        });

        setWithdrawals(data);
        setStats([
          { title: "Total Requests", amount: total.toString(), icon: "solar:wallet-outline", iconBg: "#0095DA", percent: 0 },
          { title: "Pending", amount: pending.toString(), icon: "tdesign:time", iconBg: "#FFAC33", percent: 0 },
          { title: "Approved", amount: approved.toString(), icon: "prime:check-circle", iconBg: "#21C788", percent: 0 },
          { title: "Declined", amount: declined.toString(), icon: "gg:close-o", iconBg: "#FF4D4F", percent: 0 },
        ]);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        toast.error("Failed to fetch withdrawal requests");
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  // Approve withdrawal
  const handleApprove = async (withdrawal: WithdrawalRequest) => {
    const loadingToast = toast.loading("Processing withdrawal...");

    try {
      // Validate withdrawal data
      if (!withdrawal.bankName || !withdrawal.bankAccountNumber || !withdrawal.accountName) {
        toast.error("Missing bank details", { id: loadingToast });
        return;
      }

      if (!withdrawal.withdrawalAmount || withdrawal.withdrawalAmount <= 0) {
        toast.error("Invalid withdrawal amount", { id: loadingToast });
        return;
      }

      // Step 1: Get bank code from Paystack
      toast.loading("Fetching bank details...", { id: loadingToast });
      const bankCode = await getBankCodeAction(withdrawal.bankName);

      if (!bankCode) {
        toast.error(`Bank not found: ${withdrawal.bankName}`, { id: loadingToast });
        return;
      }

      // Step 2: Create transfer recipient
      toast.loading("Creating transfer recipient...", { id: loadingToast });
      const recipientResponse = await createTransferRecipientAction({
        accountNumber: withdrawal.bankAccountNumber,
        accountName: withdrawal.accountName,
        bankCode: bankCode,
      });

      if (!recipientResponse.status || !recipientResponse.data?.recipient_code) {
        toast.error("Failed to create transfer recipient", { id: loadingToast });
        return;
      }

      const recipientCode = recipientResponse.data.recipient_code;

      // Step 3: Initiate withdrawal transfer
      toast.loading("Initiating transfer...", { id: loadingToast });
      const reference = generateRef();
      const transferResponse = await initiateWithdrawalAction({
        amount: withdrawal.withdrawalAmount,
        recipient: recipientCode,
        reason: `Withdrawal for ${withdrawal.name} (${withdrawal.user_type})`,
        reference: reference,
      });

      console.log("Transfer Response", transferResponse);

      if (!transferResponse.status) {
        toast.error("Transfer failed", { id: loadingToast });
        return;
      }

      // Step 4: Update withdrawal status in Firebase (Keep as Pending until finalized)
      toast.loading("Updating withdrawal status...", { id: loadingToast });
      const withdrawalRef = doc(db, "withdrawalRequest", withdrawal.id);
      await updateDoc(withdrawalRef, {
        status: "Pending", // Keep as Pending until OTP finalization
        lastPayOutDate: new Date(),
        updatedAt: new Date(),
        paystackReference: reference,
        paystackRecipientCode: recipientCode,
        paystackTransferCode: transferResponse.data?.transfer_code || null,
      });

      toast.success("Withdrawal approved and transfer initiated successfully!", { id: loadingToast });
      setViewUserDetails(false);

      // Refresh data
      window.location.reload();
    } catch (error: any) {
      console.error("Error approving withdrawal:", error);
      const errorMessage = error?.message || "Failed to approve withdrawal";
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  // Decline withdrawal and refund to wallet
  const handleDecline = async (withdrawal: WithdrawalRequest) => {
    try {
      // Update withdrawal status
      const withdrawalRef = doc(db, "withdrawalRequest", withdrawal.id);
      await updateDoc(withdrawalRef, {
        status: "Declined",
        updatedAt: new Date(),
      });

      // Determine wallet collection based on user type
      let walletCollection = "";
      let userId = "";

      if (withdrawal.user_type === "Customer") {
        walletCollection = "customer_wallet";
        userId = withdrawal.customerId || "";
      } else if (withdrawal.user_type === "Vendor") {
        walletCollection = "vendor_wallet";
        userId = withdrawal.vendorId || "";
      } else if (withdrawal.user_type === "Rider") {
        walletCollection = "rider_wallet";
        userId = withdrawal.riderId || "";
      }

      if (walletCollection && userId) {
        // Get current wallet
        const walletRef = doc(db, walletCollection, userId);
        const walletSnap = await getDoc(walletRef);

        if (walletSnap.exists()) {
          const currentBalance = walletSnap.data().balance || 0;
          const newBalance = currentBalance + withdrawal.withdrawalAmount;

          // Update wallet balance
          await updateDoc(walletRef, {
            balance: newBalance,
            updatedAt: new Date(),
          });
        } else {
          // Create wallet if doesn't exist
          await setDoc(walletRef, {
            balance: withdrawal.withdrawalAmount,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      toast.success("Withdrawal declined and amount refunded to wallet");
      setViewUserDetails(false);

      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error("Error declining withdrawal:", error);
      toast.error("Failed to decline withdrawal");
    }
  };

  // Filter withdrawals
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      searchTerm === "" ||
      withdrawal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.bankName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      withdrawal.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesUserType =
      userTypeFilter === "" ||
      withdrawal.user_type?.toLowerCase() === userTypeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesUserType;
  });

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "declined", label: "Declined" },
  ];

  const userTypeOptions = [
    { value: "", label: "All Types" },
    { value: "customer", label: "Customer" },
    { value: "vendor", label: "Vendor" },
    { value: "rider", label: "Rider" },
  ];

  const handleViewDetails = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setViewUserDetails(true);
    setActiveRowId(null);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={stats} />
      </div>
      <InfoAlert
        icon="si:warning-line"
        text="All earnings are credited to the user's wallet. Withdrawals require admin approval before funds are sent to their bank account."
      />
      <Table
        heading="Withdrawals"
        subtitle="Manage rider payouts, vendor settlements, and withdrawal requests"
        tableHead={withdrawalHead}
        tableData={filteredWithdrawals}
        renderRow={(row) => (
          <>
            <td className="px-6 max-w-[220px]">
              <h4 className="text-sm truncate">{row.name}</h4>
              <p className="text-xs truncate text-[#7C7979]">
                {row.accountName}
              </p>
            </td>
            <td className="px-6">{row.user_type}</td>
            <td className="px-6">₦{row.walletBalance?.toLocaleString()}</td>
            <td className="px-6">
              {row.lastPayOutDate
                ? new Date(row.lastPayOutDate.seconds * 1000).toLocaleDateString()
                : "N/A"}
            </td>
            <td className="px-6">₦{row.withdrawalAmount?.toLocaleString()}</td>
            <td className="px-6">
              {row.status === "Pending" && row.paystackTransferCode ? (
                <div className="flex flex-col gap-1">
                  <StatusTab status="Pending" />
                  <span className="text-[10px] text-blue-600 font-medium flex items-center gap-1">
                    <Icon icon="mdi:clock-alert-outline" /> Needs Finalization
                  </span>
                </div>
              ) : (
                <StatusTab status={row.status} />
              )}
            </td>
            <td className="px-6 relative">
              <div className="flex justify-center items-center">
                <Icon
                  icon={"uiw:more"}
                  width={22}
                  height={22}
                  className="cursor-pointer"
                  color="#909CAD"
                  onClick={() =>
                    setActiveRowId((prev) => (prev === row.id ? null : row.id))
                  }
                />
              </div>
              {activeRowId === row.id && (
                <ViewDetails onClick={() => handleViewDetails(row)} />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-4/5">
          <SearchInput
            name="search"
            value={searchTerm}
            placeholder="Search by name, account, or bank..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/5 flex items-center gap-2">
          <DropDown
            name="status"
            value={statusFilter}
            placeholder="Status"
            options={statusOptions}
            onChange={(value) => setStatusFilter(value)}
          />
          <DropDown
            name="userType"
            value={userTypeFilter}
            placeholder="User Type"
            options={userTypeOptions}
            onChange={(value) => setUserTypeFilter(value)}
          />
        </div>
      </Table>

      {/* user details modal */}
      <UserDetailsModal
        isOpen={viewUserDetails}
        onClose={() => setViewUserDetails(false)}
        withdrawal={selectedWithdrawal}
        onApprove={handleApprove}
        onDecline={handleDecline}
      />

      <Toaster position="top-right" />
    </section>
  );
}
