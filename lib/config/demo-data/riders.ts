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
    "Account Status",
    "Completed Deliveries",
    "Registration",
    "Actions",
];