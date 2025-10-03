"use client";

// change later to api data
import {
  withdrawalData,
  withdrawalHead,
  withdrawalStats,
} from "@/lib/config/demo-data/withdrawals";
import SearchInput from "@/ui/forms/search-input";
import DropDown from "@/ui/forms/select-dropdown";
import InfoAlert from "@/ui/info-alert";
import DashboardStatCard from "@/ui/stat-card";
import StatusTab from "@/ui/status-tab";
import Table from "@/ui/table";
import { useState } from "react";
import { Icon } from "@iconify/react";
import UserDetailsModal from "@/components/withdrawals/user-details-modal";
import { useWithdrawalModal } from "@/utils/withdrawal-utility";
import ViewDetails from "@/ui/table-action";

export default function Withdrawals() {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const {
    viewUserDetails,
    setViewUserDetails,
    selectedUser,
    handleViewUserDetails,
  } = useWithdrawalModal();
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard data={withdrawalStats} />
      </div>
      <InfoAlert
        icon="si:warning-line"
        text="All earnings are credited to the user's wallet. Withdrawals require admin approval before funds are sent to their bank account."
      />
      <Table
        heading="Withdrawals"
        subtitle="Manage rider payouts, vendor settlements, and withdrawal requests"
        tableHead={withdrawalHead}
        tableData={withdrawalData}
        renderRow={(row) => (
          <>
            <td className="px-6 max-w-[220px]">
              <h4 className="text-sm truncate">{row.name.fullName}</h4>
              <p className="text-xs truncate text-[#7C7979]">
                {row.name.phoneNumber}
              </p>
            </td>
            <td className="px-6">{row.userType}</td>
            <td className="px-6">₦{row.walletBalance}</td>
            <td className="px-6">{row.lastPayoutDate}</td>
            <td className="px-6">{row.withdrawal}</td>
            <td className="px-6">
              <StatusTab status={row.status} />
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
                <ViewDetails
                  onClick={() => handleViewUserDetails(row, setActiveRowId)}
                />
              )}
            </td>
          </>
        )}
      >
        <div className="w-full md:w-4/5">
          <SearchInput
            name="search"
            value=""
            placeholder="Search..."
            onChange={() => {}}
          />
        </div>
        <div className="w-full md:w-1/5 flex items-center gap-2">
          <DropDown
            name="status"
            value=""
            placeholder="Status"
            options={[]}
            onChange={() => {}}
          />
          <DropDown
            name="userType"
            value=""
            placeholder="User Type"
            options={[]}
            onChange={() => {}}
          />
        </div>
      </Table>

      {/* user details modal */}
      <UserDetailsModal
        isOpen={viewUserDetails}
        onClose={() => setViewUserDetails(false)}
        user={selectedUser}
      />
    </section>
  );
}
