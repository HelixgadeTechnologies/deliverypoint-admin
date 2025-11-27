import { Timestamp } from "firebase/firestore";

/**
 * Firebase Logistics Model
 * Represents a delivery/logistics order from Firebase
 */
export interface FirebaseLogistics {
    id?: string; // Document ID from Firestore
    basePrice: number;
    completedAt: Timestamp | null;
    createdAt: Timestamp;
    customerId: string;
    deliveryAddress: string;
    deliveryLat: number;
    deliveryLng: number;
    deliveryCity: string;
    deliveryContactName: string;
    deliveryContactPhone: string;
    deliveryState: string;
    deliveryType: "bicycle" | "motorcycle" | "van";
    distanceCharge: number;
    estimatedDistance: number;
    isFragile: boolean;
    isHighValue: boolean;
    noteToVendor: string;
    parcelDescription: string;
    paymentMethod: "wallet" | "card" | "cash";
    paymentStatus: "pending" | "paid" | "failed";
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    pickupCity: string;
    pickupContactName: string;
    pickupContactPhone: string;
    pickupState: string;
    riderId: string | null;
    status: "pending" | "in progress" | "completed" | "cancelled" | "declined";
    totalAmount: number;
    updatedAt: Timestamp | null;
    vanType: string | null;
}

/**
 * Logistics Statistics
 */
export interface LogisticsStats {
    totalDeliveries: number;
    totalBicycles: number;
    totalMotorcycles: number;
    totalVans: number;
}
