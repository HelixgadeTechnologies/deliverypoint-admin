import { Status } from "./table-data";

export type RiderDetails = {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  address: string;
  accountStatus: Status;
  deliveryStatus: Status;
  riderStatus: "Online" | "Offline";
  isOnline: boolean;
  profileCompleted: boolean;
  profilePhotoUrl: string;
  createdAt: any;
  updatedAt: any;
  registrationDate: string;
  userType: "rider";
  currentLocation: any;
  
  // Delivery Stats
  deliveryStats: {
    cancelled: number;
    completed: number;
    total: number;
    ongoing?: number;
    pending?: number;
  };
  
  // Earnings
  earnings: {
    thisMonth: number;
    thisWeek: number;
    today: number;
    total: number;
    pendingPayout?: number;
  };
  
  // Documents
  documents: {
    driversLicense: {
      url: string;
      title: string;
      size: string;
      type: string;
      uploadDate: string;
      verified: boolean;
    };
    governmentId: {
      url: string;
      title: string;
      size: string;
      type: string;
      uploadDate: string;
      verified: boolean;
    };
    vehicleInsurance?: {
      url: string;
      title: string;
      size: string;
      type: string;
      uploadDate: string;
      verified: boolean;
    };
    roadWorthiness?: {
      url: string;
      title: string;
      size: string;
      type: string;
      uploadDate: string;
      verified: boolean;
    };
  };
  
  // Vehicle Information
  vehicleInfo: {
    type: string;
    color: string;
    plateNumber: string;
    model: string;
    year: number;
    capacity: string;
  };
  
  // Ratings & Reviews
  ratings: {
    average: number;
    totalReviews: number;
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  
  // Order History
  orderHistory: {
    orderId: string;
    date: string;
    status: Status;
    total: number;
    customerName: string;
    pickupLocation: string;
    deliveryLocation: string;
    items: number;
    deliveryFee: number;
  }[];
  
  // Payment Information
  paymentInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    lastWithdrawal: string;
    withdrawalAmount: number;
    balance: number;
  };
  
  // Suspension Information
  suspensionInfo?: {
    isSuspended: boolean;
    suspensionReason?: string;
    suspendedBy?: string;
    suspensionDate?: string;
    suspensionEndDate?: string;
  };
  
  // Activity
  activity: {
    lastActive: string;
    totalHoursOnline: number;
    acceptanceRate: number;
    cancellationRate: number;
    averageDeliveryTime: number;
  };
  
  // Contact Information
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
};