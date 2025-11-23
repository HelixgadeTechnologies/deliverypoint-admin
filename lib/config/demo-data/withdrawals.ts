import { Withdrawal } from "@/types/table-data";

export const withdrawalStats = [
  {
    title: "Total Vendor Earnings",
    amount: "0",
    icon: "streamline-plump:store-2",
    iconBg: "#0095DA",
    currency: true,
  },
  {
    title: "Total Rider Earnings",
    amount: "0",
    icon: "clarity:bicycle-line",
    iconBg: "#21C788",
    currency: true,
  },
  {
    title: "Completed withdrawals",
    amount: "0",
    icon: "lsicon:motorcycle-outline",
    iconBg: "#FFAC33",
  },
  {
    title: "Pending Withdrawals",
    amount: "0",
    icon: "streamline:transfer-van",
    iconBg: "#FF4D4F",
  },
];

export const withdrawalHead = [
  "Name",
  "User Type",
  "Wallet Balance",
  "Last Payout Date",
  "No. of Withdrawal",
  "Status",
  "Actions",
];

export const withdrawalData: Withdrawal[] = [
  {
    id: "1",
    name: {
      fullName: "Mike Courier",
      phoneNumber: "+1 (555) 123-4567",
    },
    userType: "Rider",
    walletBalance: "30, 000",
    lastPayoutDate: "14 Mar, 2025",
    withdrawal: 200,
    status: "approved",
  },
    {
        id: "2",
    name: {
      fullName: "Maria Rodriguez",
      phoneNumber: "+1 (555) 123-4567",
    },
    userType: "Vendor",
    walletBalance: "30, 000",
    lastPayoutDate: "14 Mar, 2025",
    withdrawal: 200,
    status: "pending",
  },
    {
    id: "3",
    name: {
      fullName: "Mike Courier",
      phoneNumber: "+1 (555) 123-4567",
    },
    userType: "Vendor",
    walletBalance: "30, 000",
    lastPayoutDate: "14 Mar, 2025",
    withdrawal: 200,
    status: "approved",
  },
    {
        id: "4",
    name: {
      fullName: "Maria Rodriguez",
      phoneNumber: "+1 (555) 123-4567",
    },
    userType: "Rider",
    walletBalance: "30, 000",
    lastPayoutDate: "14 Mar, 2025",
    withdrawal: 200,
    status: "pending",
  },
];
