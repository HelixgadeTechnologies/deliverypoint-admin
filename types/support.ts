export type Status = "In Progress" | "Open" | "Resolved";

export type Ticket = {
  ticketID: string;
  submittedBy: string;
  userType: string;
  subject: { title: string; description: string };
  dateCreated: string;
  status: Status;
};
