import { Status } from "./table-data";

export type RiderOrderDetails = {
  orderId: string;
  status: Status;
  date: string;
  time: string;
  total: string;
  details: {
    customer: string;
    items: string[];
  };
  pickupAddress: string;
  deliveryAddress: string;
  deliveryFee: string;
  deliveryInfo?: {
    distance: string;
    time: string;
    review: string;
    rateCount: number;
  };
  cancellationReason?: string;
};
