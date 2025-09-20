// for all table datas

export type Status =
  | "In Progress"
  | "Open"
  | "Resolved"
  | "Approved"
  | "Pending";

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
  id: string | null;
  name:  { fullName: string; phoneNumber: string };
  userType: string;
  walletBalance: string;
  lastPayoutDate: string;
  withdrawal: number;
  status: Status;
//   email: string;
};