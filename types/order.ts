export interface Order {
    acceptedAt: Date | null;
    adminFee: number;

    assignedRiderId: string;

    completedAt: Date | null;
    createdAt: string;

    customerEmail: string;
    customerId: string;
    customerName: string;

    deliveredAt: Date | null;
    deliveryAddress: string;
    deliveryCharge: number;
    deliveryStatus: string;

    distanceInKm: number;

    dropoffLocation: {
        lat: number;
        lng: number;
    };

    inTransitAt: Date | null;

    items: {
        [key: string]: {
            image: string;
            name: string;
            price: number;
            quantity: number;
        };
    };

    itemsTotal: number;

    orderId: string;

    paymentMethod: string;
    paymentReference: string;
    paymentStatus: string;

    pickedUpAt: Date | null;

    pickupLocation: {
        lat: number;
        lng: number;
    };

    riderAcceptedAt: Date | null;
    riderAssignedAt: Date | null;

    riderCharge: number;
    riderId: string;
    riderName: string;
    riderOrderStatus: string;
    riderPhoneNumber: string;
    riderStatus: string;

    status: string;

    totalAmount: number;

    updatedAt: Date | null;

    vendorAcceptedAt: Date | null;
    vendorAddress: string;
    vendorCharge: number;
    vendorId: string;
    vendorName: string;
    vendorStatus: string;
}
