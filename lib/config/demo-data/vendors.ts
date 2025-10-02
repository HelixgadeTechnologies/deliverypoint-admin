import { VendorOrderDetails } from "@/types/vendors";
import { Vendor } from "@/types/table-data";

export const vendorStats = [
  {
    title: "All Vendors",
    amount: "0",
    icon: "streamline-plump:store-2",
    iconBg: "#0095DA",
    percent: 0,
  },
  {
    title: "Pending Vendors",
    amount: "0",
    icon: "lucide:users",
    iconBg: "#FFAC33",
    percent: 0,
  },
  {
    title: "Active Vendors",
    amount: "0",
    icon: "lucide:users",
    iconBg: "#886CE4",
    percent: 0,
  },
  {
    title: "Suspended Vendors",
    amount: "0",
    icon: "lucide:users",
    iconBg: "#FF4D4F",
    percent: 0,
  },
];

export const vendorHead = [
  "Vendor",
  "Contact Info",
  "Status",
  "Total Orders",
  "Registration",
  "Actions",
];

export const vendorData: Vendor[] = [
  {
    id: "1",
    vendor: {
      image: "/vendor-pfp.svg",
      vendorName: "Maria Rodriguez",
      vendorBusiness: "Pizza Palace",
    },
    contact: {
      email: "maria@pizzapalace.com",
      phone: "+1 (555) 123-4567",
    },
    status: "Active",
    totalOrders: "1,247",
    registration: "14 Mar, 2025	",
  },
  {
    id: "2",
    vendor: {
      image: "/vendor-pfp.svg",
      vendorName: "Maria Rodriguez",
      vendorBusiness: "Pizza Palace",
    },
    contact: {
      email: "maria@pizzapalace.com",
      phone: "+1 (555) 123-4567",
    },
    status: "Suspended",
    totalOrders: "1,247",
    registration: "14 Mar, 2025	",
  },
  {
    id: "3",
    vendor: {
      image: "/vendor-pfp.svg",
      vendorName: "Maria Rodriguez",
      vendorBusiness: "Pizza Palace",
    },
    contact: {
      email: "maria@pizzapalace.com",
      phone: "+1 (555) 123-4567",
    },
    status: "Pending",
    totalOrders: "1,247",
    registration: "14 Mar, 2025	",
  },
];

export const orderSummary = [
  {
    name: "Total Orders",
    amount: "0",
    icon: "majesticons:box-line",
    color: "#21C788",
  },
  {
    name: "Pending Orders",
    amount: "0",
    icon: "mdi-light:clock",
    color: "#FFAC33",
  },
  {
    name: "Canceled Orders",
    amount: "0",
    icon: "streamline:graph-arrow-increase",
    color: "#FF4D4F",
  },
];

export const paymentSummary = [
  {
    name: "Total Earnings",
    amount: "0",
    icon: "mynaui:dollar-solid",
    color: "#16A271",
  },
  {
    name: "Commission Taken",
    amount: "0",
    icon: "streamline:graph-arrow-increase",
    color: "#21C788",
  },
];

export const vendorOderHistory: VendorOrderDetails[] = [
  {
    orderId: "ORD0001",
    date: "2025/04/29",
    status: "Completed",
    total: "18, 705.5",
    time: "2 hours ago",
    items: [
      { item: "2x Chicken Burger (+Extra Cheese, Bacon)", price: "3,000" },
      { item: "1x Fries", price: "2,000" },
    ],
    customerInformation: {
      name: "Sarah Johnson",
      phoneNumber: "09016796847",
      address: "123 Main St, Apt 4B, Downtown Area, Lagos",
      rating: {
        rateCount: 4,
        review: "Amazing Food! with a great taste.",
      },
    },
    driversInformation: {
      name: "Haniu Joseph",
      phoneNumber: "12345678901",
    },
  },
  {
    orderId: "ORD0002",
    date: "2025/04/29",
    status: "In Progress",
    total: "18, 705.5",
    time: "2 hours ago",
    items: [
      { item: "2x Chicken Burger (+Extra Cheese, Bacon)", price: "3,000" },
      { item: "1x Fries", price: "2,000" },
    ],
    customerInformation: {
      name: "Jane Doe",
      phoneNumber: "09016796847",
      address: "123 Main St, Apt 4B, Downtown Area, Lagos",
    },
  },
  {
    orderId: "ORD0003",
    date: "2025/04/29",
    status: "Canceled",
    total: "18, 705.5",
    time: "2 hours ago",
    items: [
      { item: "2x Chicken Burger (+Extra Cheese, Bacon)", price: "3,000" },
      { item: "1x Fries", price: "2,000" },
    ],
    customerInformation: {
      name: "Jane Doe",
      phoneNumber: "09016796847",
      address: "123 Main St, Apt 4B, Downtown Area, Lagos",
    },
    cancellationReason: "Items were accidentally ordered.",
  },
];
