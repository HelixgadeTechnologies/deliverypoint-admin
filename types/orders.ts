import { Status } from "./table-data";
export type OrderItems = {
  item: string;
  price: string;
};
export type OrderDetails = {
  orderId: string;
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
