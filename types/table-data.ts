// for all table datas

export type Status =
  | "In Progress"
  | "Open"
  | "Resolved"
  | "Approved"
  | "Pending"
  | "Active"
  | "Suspended"
  | "Completed"
  | "Canceled"
  | "Rejected";

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
  name: { fullName: string; phoneNumber: string };
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
};

export type Orders = {
  orderId: string;
  date: string;
  status: Status;
  amount: string;
};

export type Riders = {
  id: string;
  rider: {
    image: string;
    name: string;
    email: string;
  };
  vehicleType: "Motorcycle" | "Bicycle" | "Van";
  riderStatus: "Offline" | "Online";
  deliveryStatus: Status;
  completedDeliveries: string;
  registration: string;
};

export type Users = {
  id: string;
  user: {
    image: string;
    name: string;
    email: string;
  };
  phoneNumber: string;
  status: Status;
  totalOrders: string;
  registration: string;
}