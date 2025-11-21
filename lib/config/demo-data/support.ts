import { Ticket } from "@/types/table-data";

export const supportStats = [
    {
      title: "Total Tickets",
      amount: "0",
      icon: "majesticons:headset-line",
      iconBg: "#0095DA",
    },
    {
      title: "Open Tickets",
      amount: "0",
      icon: "simple-line-icons:close",
      iconBg: "#FF4D4F",
    },
    {
      title: "In Progress",
      amount: "0",
      icon: "ion:time-outline",
      iconBg: "#FFAC33",
    },
    {
      title: "Resolved Today",
      amount: "0",
      icon: "simple-line-icons:check",
      iconBg: "#21C788",
    },
  ];

  export const supportHead = [
    "Ticket ID",
    "Description",
    "User Email",
    "Priority",
    "Date Created",
    "Status",
    "Actions",
  ];

  export const supportTickets: Ticket[] = [
    {
      id: "1",
      ticketID: "#TK-1001",
      submittedBy: "John Doe",
      userType: "Rider",
      subject: {
        title: "App Keeps Crashing",
        description: "The rider app keeps crashing when I try to mark ...",
      },
      dateCreated: "14 Mar, 2025	",
      status: "In Progress",
      email: "john.doe@example.com",
    },
    {
      id: "2",
      ticketID: "#TK-1002",
      submittedBy: "John Doe",
      userType: "User",
      subject: {
        title: "Order not received",
        description:
          "My order #ORD-12345 was marked as delivered but I never received it. The rider said they left it at my door but nothing was there.",
      },
      dateCreated: "14 Mar, 2025	",
      status: "Resolved",
      email: "john.doe@example.com",
    },
    {
      id: "3",
      ticketID: "#TK-1003",
      submittedBy: "John Doe",
      userType: "Vendor",
      subject: {
        title: "Payment Settlement Delay",
        description: "My weekly settlement is 3 days late. Usually receiv...",
      },
      dateCreated: "14 Mar, 2025	",
      status: "Open",
      email: "john.doe@example.com",
    },
  ];