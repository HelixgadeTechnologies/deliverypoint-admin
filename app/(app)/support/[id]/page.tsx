// @typescript-eslint/no-unused-vars

"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import CardComponent from "@/ui/card-wrapper";
import Button from "@/ui/button";
import StatusTab from "@/ui/status-tab";
import { JSX, useState, useEffect } from "react";
import Modal from "@/ui/popup-modal";
import Heading from "@/ui/text-heading";
import TextareaInput from "@/ui/forms/textarea";
import BackButton from "@/ui/back-button";
import { doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { toast, Toaster } from "react-hot-toast";
import { Status } from "@/types/table-data";
import Loading from "@/app/loading";
import { formatDate } from "@/utils/date-utility";
import { useCallback } from "react";


interface SupportTicket {
  id: string;
  ticketId: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  adminId: string | null;
  adminResponse: string | null;
  subject: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: Status;
  createdAt: string;
  updatedAt: string;
  respondedAt: string | null;
}

interface UserInfo {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  accountType?: string;
  profilePhotoUrl?: string;
  city?: string;
  state?: string;
  address?: string;
  businessName?: string;
}

export default function SupportDetails() {
  const pathname = usePathname();
  const [confirmResolve, setConfirmResolve] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  // const [userLoading, setUserLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const ticketId = pathname.split("/").pop();

// Move fetchUserInfo outside useEffect and wrap in useCallback
const fetchUserInfo = useCallback(async (ticket: SupportTicket) => {
  if (!ticket.vendorId) return;

  try {
    // Try to fetch from vendors collection first
    const vendorRef = doc(db, "vendors", ticket.vendorId);
    const vendorSnapshot = await getDoc(vendorRef);
    
    if (vendorSnapshot.exists()) {
      const vendorData = vendorSnapshot.data() as UserInfo;
      setUserInfo({
        ...vendorData,
        accountType: "vendor"
      });
    } else {
      // If vendor not found, try other collections
      const collections = ["riders", "customers"];
      let found = false;
      
      for (const collectionName of collections) {
        const userRef = doc(db, collectionName, ticket.vendorId);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as UserInfo;
          setUserInfo({
            ...userData,
            accountType: collectionName === "riders" ? "rider" : "customer"
          });
          found = true;
          break;
        }
      }
      
      // If still not found, set basic info from ticket
      if (!found) {
        setUserInfo({
          email: ticket.vendorEmail,
          accountType: "vendor",
        });
      }
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    // Fallback to ticket data
    setUserInfo({
      email: ticket.vendorEmail,
      accountType: "vendor",
    });
  }
}, []);

// Fetch support ticket data from Firestore
useEffect(() => {
  if (!ticketId) return;

  const ticketRef = doc(db, "support_tickets", ticketId);

  // Set up real-time listener
  const unsubscribe = onSnapshot(
    ticketRef,
    async (docSnapshot) => {
      try {
        if (docSnapshot.exists()) {
          const ticketData = docSnapshot.data();
          
          const updatedTicket = {
            id: docSnapshot.id,
            ...ticketData,
          } as SupportTicket;

          setSelectedTicket(updatedTicket);
          setAdminResponse(ticketData.adminResponse || "");

          // Fetch additional user info
          await fetchUserInfo(updatedTicket);
        } else {
          setSelectedTicket(null);
          setUserInfo(null);
        }
      } catch (error) {
        console.error("Error in ticket snapshot:", error);
        toast.error("Failed to load ticket details");
      } finally {
        setLoading(false);
      }
    },
    (error) => {
      console.error("Error fetching support ticket:", error);
      toast.error("Failed to load ticket details");
      setLoading(false);
    }
  );

  // Cleanup function
  return () => unsubscribe();
}, [ticketId, fetchUserInfo]);

  // Function to get display name from user info
  const getDisplayName = (): string => {
    if (userInfo?.businessName) return userInfo.businessName;
    if (userInfo?.fullName) return userInfo.fullName;
    if (userInfo?.firstName && userInfo?.lastName) {
      return `${userInfo.firstName} ${userInfo.lastName}`;
    }
    return selectedTicket?.vendorName || "N/A";
  };

  // Function to get account type display name
  const getAccountTypeDisplay = (): string => {
    if (userInfo?.accountType) {
      switch (userInfo.accountType) {
        case "vendor": return "Vendor";
        case "rider": return "Rider";
        case "customer": return "Customer";
        default: return userInfo.accountType;
      }
    }
    return "Vendor"; // default based on your data structure
  };

  // Function to update ticket status
  const updateTicketStatus = async (
    newStatus: "in progress" | "resolved" | "closed"
  ) => {
    if (!selectedTicket || !ticketId) return;

    setUpdating(true);
    try {
      const ticketRef = doc(db, "support_tickets", ticketId);
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      // If resolving or closing, add admin response and respondedAt
      if (newStatus === "resolved" || newStatus === "closed") {
        updateData.adminResponse =
          adminResponse || selectedTicket.adminResponse;
        updateData.respondedAt = new Date().toISOString();
        // You might want to set adminId here if you have admin authentication
        // updateData.adminId = currentAdminUser.uid;
      }

      await updateDoc(ticketRef, updateData);

      toast.success(`Ticket marked as ${newStatus}`);
      setConfirmResolve(false);
    } catch (error: any) {
      console.error("Error updating ticket status:", error);
      toast.error(error.message || "Failed to update ticket");
    } finally {
      setUpdating(false);
    }
  };

  // Function to handle mark as in progress
  const handleMarkInProgress = async () => {
    await updateTicketStatus("in progress");
  };

  // Function to handle mark as resolved
  const handleMarkResolved = async () => {
    await updateTicketStatus("resolved");
  };

  // Function to handle mark as closed
  const handleMarkClosed = async () => {
    await updateTicketStatus("closed");
  };

  // Handle admin response change
  const handleAdminResponseChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAdminResponse(e.target.value);
  };

  if (loading) return <Loading/>;
  if (!selectedTicket) {
    return (
      <CardComponent>
        <div className="flex justify-center items-center h-40">
          <p>Ticket not found.</p>
        </div>
      </CardComponent>
    );
  }

  // for buttons - using lowercase status values to match Firestore
  const statusActions: Record<string, JSX.Element> = {
    open: (
      <div className="gap-2 items-center flex w-full md:w-[400px]">
        <Button
          content="Mark as In Progress"
          variant="success"
          isSecondary
          onClick={handleMarkInProgress}
          isDisabled={updating}
        />
        <Button
          content="Mark as Resolved"
          variant="success"
          onClick={() => setConfirmResolve(true)}
          isDisabled={updating}
        />
      </div>
    ),
    "in progress": (
      <div className="w-full md:w-[200px]">
        <Button
          content="Mark as Resolved"
          variant="success"
          onClick={() => setConfirmResolve(true)}
          isDisabled={updating}
        />
      </div>
    ),
    resolved: (
      <div className="w-full md:w-[200px]">
        <Button
          content="Close Ticket"
          variant="success"
          onClick={handleMarkClosed}
          isDisabled={updating}
        />
      </div>
    ),
  };

  // for card on resolved/closed tickets
  const statusCard: Record<string, JSX.Element> = {
    resolved: (
      <div className="bg-[#0095DA15] py-2 px-4 rounded-2xl primary w-full">
        <h4 className="font-semibold text-base">Admin Response</h4>
        <p className="text-sm font-normal">
          {selectedTicket.adminResponse || "No admin response provided."}
        </p>
        {selectedTicket.respondedAt && (
          <p className="text-xs text-[#7C7979] mt-1">
            Responded: {formatDate(selectedTicket.respondedAt)}
          </p>
        )}
      </div>
    ),
    closed: (
      <div className="bg-[#0095DA15] py-2 px-4 rounded-2xl primary w-full">
        <h4 className="font-semibold text-base">Admin Response</h4>
        <p className="text-sm font-normal">
          {selectedTicket.adminResponse || "No admin response provided."}
        </p>
        {selectedTicket.respondedAt && (
          <p className="text-xs text-[#7C7979] mt-1">
            Responded: {formatDate(selectedTicket.respondedAt)}
          </p>
        )}
      </div>
    ),
  };

  return (
    <>
      <Toaster position="top-right" />
      <CardComponent>
        <div className="space-y-6">
          {/* back button */}
          <BackButton text="Back to Support" />

          {/* header */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start relative gap-3">
              <div className="size-11 flex justify-center items-center bg-[#0095DA] rounded-lg">
                <Icon
                  icon="cuida:ticket-outline"
                  height={24}
                  width={24}
                  color="#fff"
                />
              </div>
              <div className="mr-5">
                <h4 className="text-base truncate">
                  {selectedTicket.ticketId || "N/A"}
                </h4>
                <p className="text-sm truncate text-[#7C7979]">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-[#7C7979] capitalize">
                  {getAccountTypeDisplay()}
                </p>
              </div>
              <StatusTab status={selectedTicket.status} />
            </div>

            {/* status-based actions */}
            {statusActions[selectedTicket.status]}
          </div>
          {/* body */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-3/5">
              <CardComponent>
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-[#1F1F1F]">
                    Ticket Information
                  </h4>
                  {/* subject */}
                  <div className="text-sm">
                    <p className="font-medium">Subject</p>
                    <p className="text-[#6E747D] mt-1 capitalize">
                      {selectedTicket.subject || "N/A"}
                    </p>
                  </div>
                  {/* description */}
                  <div className="text-sm">
                    <p className="font-medium">Ticket Description</p>
                    <p className="text-[#6E747D] mt-1">
                      {selectedTicket.description || "N/A"}
                    </p>
                  </div>
                  {/* priority */}
                  <div className="text-sm">
                    <p className="font-medium">Priority</p>
                    <p className="text-[#6E747D] mt-1 capitalize">
                      {selectedTicket.priority || "N/A"}
                    </p>
                  </div>
                  {/* user type */}
                  <div className="text-sm">
                    <p className="font-medium">User Type</p>
                    <p className="text-[#6E747D] mt-1 capitalize">
                      {getAccountTypeDisplay()}
                    </p>
                  </div>
                  {/* status based card */}
                  {statusCard[selectedTicket.status]}
                </div>
              </CardComponent>
            </div>
            <div className="w-full md:w-2/5">
              <CardComponent>
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-[#1F1F1F]">
                    User Information
                  </h4>
                  {/* user name */}
                  <div className="text-sm">
                    <p className="font-medium">Name</p>
                    <p className="text-[#6E747D] mt-1 capitalize">
                      {getDisplayName()}
                    </p>
                  </div>
                  {/* user email */}
                  <div className="text-sm">
                    <p className="font-medium">Email Address</p>
                    <p className="text-[#6E747D] mt-1">
                      {selectedTicket.vendorEmail || "N/A"}
                    </p>
                  </div>
                  {/* user ID */}
                  <div className="text-sm">
                    <p className="font-medium">User ID</p>
                    <p className="text-[#6E747D] mt-1 font-mono text-xs">
                      {selectedTicket.vendorId || "N/A"}
                    </p>
                  </div>
                  {/* account type */}
                  <div className="text-sm">
                    <p className="font-medium">Account Type</p>
                    <p className="text-[#6E747D] mt-1 capitalize">
                      {getAccountTypeDisplay()}
                    </p>
                  </div>
                  {/* phone number (if available) */}
                  {userInfo?.phoneNumber && (
                    <div className="text-sm">
                      <p className="font-medium">Phone Number</p>
                      <p className="text-[#6E747D] mt-1">
                        {userInfo.phoneNumber}
                      </p>
                    </div>
                  )}
                  {/* location (if available) */}
                  {(userInfo?.city || userInfo?.state) && (
                    <div className="text-sm">
                      <p className="font-medium">Location</p>
                      <p className="text-[#6E747D] mt-1 capitalize">
                        {[userInfo.city, userInfo.state].filter(Boolean).join(", ") || "N/A"}
                      </p>
                    </div>
                  )}
                  {/* created date */}
                  <div className="text-sm">
                    <p className="font-medium">Ticket Created</p>
                    <p className="text-[#6E747D] mt-1">
                      {formatDate(selectedTicket.createdAt)}
                    </p>
                  </div>
                  {/* last updated */}
                  <div className="text-sm">
                    <p className="font-medium">Last Updated</p>
                    <p className="text-[#6E747D] mt-1">
                      {formatDate(selectedTicket.updatedAt)}
                    </p>
                  </div>
                </div>
              </CardComponent>
            </div>
          </div>
        </div>
      </CardComponent>

      <Modal
        isOpen={confirmResolve}
        onClose={() => setConfirmResolve(false)}
        maxWidth="700px">
        <div className="space-y-6">
          <Heading
            heading="Mark as Resolved"
            subtitle="Are you sure you want to resolve this complaint?"
          />
          <TextareaInput
            label="Admin Response"
            value={adminResponse}
            placeholder="Add your response to the user..."
            name="adminResponse"
            onChange={handleAdminResponseChange}
          />
          <div className="gap-2 items-center flex md:w-[400px]">
            <Button
              content="Cancel"
              variant="success"
              isSecondary
              onClick={() => setConfirmResolve(false)}
              isDisabled={updating}
            />
            <Button
              content={updating ? "Updating..." : "Mark as Resolved"}
              variant="success"
              onClick={handleMarkResolved}
              isDisabled={updating}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}