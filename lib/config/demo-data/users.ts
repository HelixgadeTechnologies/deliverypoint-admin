import { Users } from "@/types/table-data";

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