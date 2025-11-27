import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { FirebaseLogistics, LogisticsStats } from "@/types/logistics.types";
import { Logistics } from "@/types/table-data";

/**
 * Fetch all logistics records from Firebase
 */
export async function fetchLogistics(): Promise<FirebaseLogistics[]> {
    try {
        const logisticsRef = collection(db, "logistics");
        const q = query(logisticsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const logistics: FirebaseLogistics[] = [];
        querySnapshot.forEach((doc) => {
            logistics.push({
                id: doc.id,
                ...doc.data(),
            } as FirebaseLogistics);
        });

        return logistics;
    } catch (error) {
        console.error("Error fetching logistics:", error);
        throw error;
    }
}

/**
 * Fetch a single logistics record by ID
 */
export async function fetchLogisticsById(
    id: string
): Promise<FirebaseLogistics | null> {
    try {
        const docRef = doc(db, "logistics", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            } as FirebaseLogistics;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching logistics by ID:", error);
        throw error;
    }
}

/**
 * Calculate logistics statistics
 */
export function calculateLogisticsStats(
    logistics: FirebaseLogistics[]
): LogisticsStats {
    return {
        totalDeliveries: logistics.length,
        totalBicycles: logistics.filter((l) => l.deliveryType === "bicycle").length,
        totalMotorcycles: logistics.filter((l) => l.deliveryType === "motorcycle")
            .length,
        totalVans: logistics.filter((l) => l.vanType !== null).length,
    };
}

/**
 * Map Firebase logistics to UI table format
 */
export function mapFirebaseLogisticsToUI(
    firebaseLogistics: FirebaseLogistics[]
): Logistics[] {
    return firebaseLogistics.map((item) => {
        // Calculate platform fee (assuming 10% of total amount)
        const platformFee = (item.totalAmount * 0.1).toFixed(2);
        const mainEarnings = (item.totalAmount - parseFloat(platformFee)).toFixed(2);

        // Map payment method to payment type
        const paymentTypeMap: Record<string, "Card" | "Wallet" | "Cash"> = {
            card: "Card",
            wallet: "Wallet",
            cash: "Cash",
        };

        return {
            id: item.id || "",
            riderAssigned: {
                name: item.riderId || "Not Assigned",
                vehicle:
                    item.deliveryType.charAt(0).toUpperCase() +
                    item.deliveryType.slice(1),
            },
            sender: {
                name: item.pickupContactName,
                phoneNumber: item.pickupContactPhone,
            },
            pickupLocation: `${item.pickupAddress}, ${item.pickupCity}, ${item.pickupState}`,
            dropoffLocation: `${item.deliveryAddress}, ${item.deliveryCity}, ${item.deliveryState}`,
            paymentType: paymentTypeMap[item.paymentMethod] || "Wallet",
            status: item.status,
            earnings: {
                main: mainEarnings,
                platform: platformFee,
            },
        };
    });
}

/**
 * Format stats for dashboard cards
 */
export function formatStatsForDashboard(stats: LogisticsStats) {
    return [
        {
            title: "Total Parcel Delivery",
            amount: stats.totalDeliveries.toString(),
            icon: "carbon:delivery-parcel",
            iconBg: "#0095DA",
            percent: 0,
        },
        {
            title: "Total Bicycles",
            amount: stats.totalBicycles.toString(),
            icon: "clarity:bicycle-line",
            iconBg: "#21C788",
            percent: 0,
        },
        {
            title: "Total Motorcycles",
            amount: stats.totalMotorcycles.toString(),
            icon: "lsicon:motorcycle-outline",
            iconBg: "#FFAC33",
            percent: 0,
        },
        {
            title: "Total Vans",
            amount: stats.totalVans.toString(),
            icon: "streamline:transfer-van",
            iconBg: "#FF4D4F",
            percent: 0,
        },
    ];
}
