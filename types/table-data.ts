// for all table datas

export type Status =
  | "In Progress"
  | "Open"
  | "Resolved"
  | "Approved"
  | "Pending"
  | "Active"
  | "Suspended"

export type Ticket = {
  id: string;
  ticketID: string;
  submittedBy: string;
  userType: string;
  subject: { title: string; description: string };
  dateCreated: string;
  status: Status;
  email: string;
};

export type Withdrawal = {
  id: string;
  name:  { fullName: string; phoneNumber: string };
  userType: string;
  walletBalance: string;
  lastPayoutDate: string;
  withdrawal: number;
  status: Status;
};

export type Vendor = {
    id: string;
    vendor: {
        image: string;
        vendorName: string;
        vendorBusiness: string;
    };
    contact: {
        email: string;
        phone: string;
    };
    status: Status;
    totalOrders: string;
    registration: string;
}