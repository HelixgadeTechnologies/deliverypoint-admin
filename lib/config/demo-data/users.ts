import { Users } from "@/types/table-data";
import { UserOrderDetails } from "@/types/users";

export const userTableHead = [
  "Name",
  "Phone Number",
  "Status",
  "Total Orders",
  "Registration",
  "Actions",
];

export const userTableData: Users[] = [
  {
    id: "1",
    user: {
      image: "/rider-pfp.svg",
      name: "John Deli",
      email: "john@gmail.com",
    },
    phoneNumber: "+23490395543",
    status: "Active",
    totalOrders: "0",
    registration: "29 Apr 2025",
  },
  {
    id: "2",
    user: {
      image: "/rider-pfp.svg",
      name: "John Deli",
      email: "john@gmail.com",
    },
    phoneNumber: "+23490395543",
    status: "Suspended",
    totalOrders: "0",
    registration: "29 Apr 2025",
  },
];

export const userOrderHistory: UserOrderDetails[] = [
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
    vendorInformation: {
      businessName: "Mama's Kitchenhnson",
      businessType: "Restaurant",
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
    vendorInformation: {
      businessName: "Mama's Kitchen",
      businessType: "Restaurant",
      address: "123 Main St, Apt 4B, Downtown Area, Lagos",
    },
  },
  {
    orderId: "ORD0003",
    date: "2025/04/29",
    status: "Cancelled",
    total: "18, 705.5",
    time: "2 hours ago",
    items: [
      { item: "2x Chicken Burger (+Extra Cheese, Bacon)", price: "3,000" },
      { item: "1x Fries", price: "2,000" },
    ],
    vendorInformation: {
      businessName: "Mama's Kitchen",
      businessType: "Restaurant",
      address: "123 Main St, Apt 4B, Downtown Area, Lagos",
    },
    cancellationReason: "Items were accidentally ordered.",
  },
];
