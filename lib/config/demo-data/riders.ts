import { RiderOrderDetails } from "@/types/riders";
import { Riders } from "@/types/table-data";

export const riderStats = [
    {
        title: "All Riders",
        amount: "0",
        icon: "lucide:bike",
        iconBg: "#0095DA",
        percent: 0,
    },
    {
        title: "Online Riders",
        amount: "0",
        icon: "lucide:users",
        iconBg: "#886CE4",
        percent: 0,
    },
    {
        title: "Pending Riders",
        amount: "0",
        icon: "lucide:users",
        iconBg: "#FFAC33",
        percent: 0,
    },
    {
        title: "Offline Riders",
        amount: "0",
        icon: "lucide:users",
        iconBg: "#FF4D4F",
        percent: 0,
    },
];

export const riderTableHead = [
    "Rider",
    "Vehicle Type",
    "Rider Status",
    "Delivery Status",
    "Completed Deliveries",
    "Registration",
    "Actions",
];

export const riderTableData: Riders[] = [
    {
        id: "1",
        rider: {
            image: "/rider-pfp.svg",
            name: "Darlene Robertson",
            email: "darlene@gmail.com",
        },
        vehicleType: "Motorcycle",
        riderStatus: "Online",
        deliveryStatus: "Active",
        completedDeliveries: "1,247",
        registration: "14 Mar, 2025",
    },
    {
        id: "2",
        rider: {
            image: "/rider-pfp.svg",
            name: "John Doe",
            email: "johndoe@gmail.com",
        },
        vehicleType: "Bicycle",
        riderStatus: "Offline",
        deliveryStatus: "Pending",
        completedDeliveries: "1,247",
        registration: "14 Mar, 2025",
    },
    {
        id: "3",
        rider: {
            image: "/rider-pfp.svg",
            name: "John Doe",
            email: "johndoe@gmail.com",
        },
        vehicleType: "Van",
        riderStatus: "Offline",
        deliveryStatus: "Suspended",
        completedDeliveries: "1,247",
        registration: "14 Mar, 2025",
    },
];

export const deliverySummary = [
  {
    name: "Total Deliveries",
    amount: "0",
    icon: "majesticons:box-line",
    color: "#21C788",
  },
  {
    name: "Pending Deliveries",
    amount: "0",
    icon: "mdi-light:clock",
    color: "#FFAC33",
  },
  {
    name: "Reject Deliveries",
    amount: "0",
    icon: "streamline:graph-arrow-increase",
    color: "#FF4D4F",
  },
];

export const riderOrderHistory: RiderOrderDetails[] = [
    {
        orderId: "ORD001",
        status: "Completed",
        date: "2025-04-29",
        time: "2 hours ago",
        total: "18.705",
        details: {
            customer: "James O",
            items: ["1x Jollof  Rice + Meat", "1x Plantain"]
        },
        pickupAddress: "Mama's Kitchen 123 Main St, Downtown",
        deliveryAddress: "123 Main St, Downtown",
        deliveryFee: "500",
        deliveryInfo: {
            distance: "0.8 km",
            time: "8 Minutes",
            review: "Amazing delivery services",
            rateCount: 3,
        },
    },
    {
        orderId: "ORD002",
        status: "In Progress",
        date: "2025-04-29",
        time: "2 hours ago",
        total: "18.705",
        details: {
            customer: "James O",
            items: ["1x Jollof  Rice + Meat", "1x Plantain"]
        },
        pickupAddress: "Mama's Kitchen 123 Main St, Downtown",
        deliveryAddress: "123 Main St, Downtown",
        deliveryFee: "500",
    },
    {
        orderId: "ORD003",
        status: "Rejected",
        date: "2025-04-29",
        time: "2 hours ago",
        total: "18.705",
        details: {
            customer: "James O",
            items: ["1x Jollof  Rice + Meat", "1x Plantain"]
        },
        pickupAddress: "Mama's Kitchen 123 Main St, Downtown",
        deliveryAddress: "123 Main St, Downtown",
        deliveryFee: "500",
        cancellationReason: "Order not in my route"
    },
];