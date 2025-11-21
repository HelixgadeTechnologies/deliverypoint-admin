import { Status } from "./table-data";
export type OrderItems = {
  item: string;
  price: string;
};
export type VendorOrderDetails = {
  id: string;
  status: Status;
  date: string;
  time: string;
  total: string;
  items?: OrderItems[];
  customerInformation: {
    name: string;
    phoneNumber: string;
    address: string;
    rating?: {
      rateCount: number;
      review: string;
    };
  };
  driversInformation?: {
    name: string;
    phoneNumber: string;
  };
  cancellationReason?: string;
};

export type OperatingHours = {
  close?: string;
  isOpen: boolean;
  open?: string;
}

export type BusinessAddress = {
  address: string;
  city: string;
  fullAddress: string;
  state: string;
}

export interface VendorData {
  id: string;
  vendor: {
    vendorName: string;
    vendorBusiness: string;
    image: string;
    email?: string;
    phoneNumber?: string;
    businessAddress?: BusinessAddress;
    businessCategory?: string;
    createdAt?: string;
    operatingHours?: {
      monday: OperatingHours;
      tuesday: OperatingHours;
      wednesday: OperatingHours;
      thursday: OperatingHours;
      friday: OperatingHours;
      saturday: OperatingHours;
      sunday: OperatingHours;
    };
  };
  status: Status;
  businessLicenseMetadata?: {
    fileExtension: string;
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    url: string;
  };
  address?: string;
  city?: string;
  state?: string;
  fullAddress?: string;
  businessDescription?: string;
  businessCategory?: string;
}
