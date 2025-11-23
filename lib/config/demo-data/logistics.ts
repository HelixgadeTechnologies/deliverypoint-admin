import { Logistics } from "@/types/table-data";

export const logisticsStats = [
  {
    title: "Total Parcel Delivery",
    amount: "0",
    icon: "carbon:delivery-parcel",
    iconBg: "#0095DA",
    percent: 0,
  },
  {
    title: "Total Bicycles",
    amount: "0",
    icon: "clarity:bicycle-line",
    iconBg: "#21C788",
    percent: 0,
  },
  {
    title: "Total Motorcycles",
    amount: "0",
    icon: "lsicon:motorcycle-outline",
    iconBg: "#FFAC33",
    percent: 0,
  },
  {
    title: "Total Vans",
    amount: "0",
    icon: "streamline:transfer-van",
    iconBg: "#FF4D4F",
    percent: 0,
  },
];

export const logisticsTableHead = [
  "Order ID",
  "Rider Assigned",
  "Sender",
  "Pickup Location",
  "Drop-off Location",
  "Payment Type",
  "Status",
  "Earnings",
  "Actions",
];

export const logisticsData: Logistics[] = [
  {
    id: "ORD001",
    riderAssigned: {
      name: "Johnny Rider",
      vehicle: "Bicycle",
    },
    sender: {
      name: "Jane Doe",
      phoneNumber: "+1 (555) 123-4567",
    },
    pickupLocation: "123 Main St, Apt 4B",
    dropoffLocation: "456 Residential St",
    paymentType: "Card",
    status: "completed",
    earnings: {
      main:  "2,600",
      platform: "250",
    },
  },
  {
    id: "ORD002",
    riderAssigned: {
      name: "Johnny Rider",
      vehicle: "Bicycle",
    },
    sender: {
      name: "Jane Doe",
      phoneNumber: "+1 (555) 123-4567",
    },
    pickupLocation: "123 Main St, Apt 4B",
    dropoffLocation: "456 Residential St",
    paymentType: "Cash",
    status: "in progress",
    earnings: {
      main:  "2,600",
      platform: "250",
    },
  },
  {
    id: "ORD003",
    riderAssigned: {
      name: "Johnny Rider",
      vehicle: "Bicycle",
    },
    sender: {
      name: "Jane Doe",
      phoneNumber: "+1 (555) 123-4567",
    },
    pickupLocation: "123 Main St, Apt 4B",
    dropoffLocation: "456 Residential St",
    paymentType: "Wallet",
    status: "declined",
    earnings: {
      main:  "2,600",
      platform: "250",
    },
  },
]