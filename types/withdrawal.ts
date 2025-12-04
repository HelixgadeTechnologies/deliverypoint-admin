export interface WithdrawalRequest {
    id: string;
    NoOfWithdrawal: number;
    accountName: string;
    bankAccountNumber: string;
    bankName: string;
    createdAt: any; // Firestore Timestamp
    lastPayOutDate: any | null; // Firestore Timestamp or null
    name: string;
    riderId?: string;
    vendorId?: string;
    customerId?: string;
    status: "Pending" | "Approved" | "Declined";
    updatedAt: any; // Firestore Timestamp
    user_type: "Rider" | "Vendor" | "Customer";
    walletBalance: number;
    withdrawalAmount: number;
}
