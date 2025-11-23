import { Orders } from "@/types/table-data";

export const orderStats = [
  {
    title: "Orders",
    amount: "0",
    icon: "solar:wallet-outline",
    iconBg: "#0095DA",
    percent: 0,
  },
  {
    title: "Completed",
    amount: "0",
    icon: "prime:check-circle",
    iconBg: "#21C788",
    percent: 0,
  },
  {
    title: "In Progress",
    amount: "0",
    icon: "tdesign:time",
    iconBg: "#FFAC33",
    percent: 0,
  },
  {
    title: "Declined/Cancelled",
    amount: "0",
    icon: "gg:close-o",
    iconBg: "#FF4D4F",
    percent: 0,
  },
];

export const orderTableHead = [
  "Order ID",
  "Customer Details",
  "Pickup Location",
  "Drop-off Location",
  "Rider Name",
  "Vendor Name",
  "Status",
  "Earnings",
  "Actions",
];

export const orderTableData: Orders[] = [
  {
    id: "ORD001",
    customerDetails: {
      name: "Sarah Johnson",
      phoneNumber: "+1 (555) 123-4567",
    },
    pickupLocation: "McDonald's Downtown",
    dropOffLocation: "123 Main St, Apt 4B",
    riderName: "John Rider",
    vendorName: "McDonald's",
    status: "completed",
    earnings: {
      main: "2,600",
      platform: 250,
    },
  },
  {
    id: "ORD002",
    customerDetails: {
      name: "Sarah Johnson",
      phoneNumber: "+1 (555) 123-4567",
    },
    pickupLocation: "McDonald's Downtown",
    dropOffLocation: "123 Main St, Apt 4B",
    riderName: "John Rider",
    vendorName: "McDonald's",
    status: "cancelled",
    earnings: {
      main: "2,600",
      platform: 250,
    },
  },
  {
    id: "ORD003",
    customerDetails: {
      name: "Sarah Johnson",
      phoneNumber: "+1 (555) 123-4567",
    },
    pickupLocation: "McDonald's Downtown",
    dropOffLocation: "123 Main St, Apt 4B",
    riderName: "John Rider",
    vendorName: "McDonald's",
    status: "in progress",
    earnings: {
      main: "2,600",
      platform: 250,
    },
  },
    {
    id: "ORD004",
    customerDetails: {
      name: "Sarah Johnson",
      phoneNumber: "+1 (555) 123-4567",
    },
    pickupLocation: "McDonald's Downtown",
    dropOffLocation: "123 Main St, Apt 4B",
    riderName: "John Rider",
    vendorName: "McDonald's",
    status: "declined",
    earnings: {
      main: "2,600",
      platform: 250,
    },
  },
];
