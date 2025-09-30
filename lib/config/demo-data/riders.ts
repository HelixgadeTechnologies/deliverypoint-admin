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