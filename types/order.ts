export interface OrderItem {
    image: string;
    name: string;
    price: number;
    quantity: number;
    vendor: string;
    vendorId: string;
}

export interface Order {
    id: string; // Document ID
    createdAt: string;
    customerId: string;
    customerName: string;
    deliveryAddress: string;
    items: Record<string, OrderItem>;
    orderId: string;
    paymentMethod: string;
    paymentReference: string;
    riderId: string;
    status: string;
    isDelivered: boolean;
    isCanceled: boolean;
    canceledDate: string;
    deliveryDate: string;
    totalAmount: number;
    updatedAt: string;
    vendorId: string; // "multiple" or specific ID
}
