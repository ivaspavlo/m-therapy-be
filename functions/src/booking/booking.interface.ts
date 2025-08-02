export interface IBookingSlot {
  id: string;
  productId: string;
  start: number;
  end: number;
  isBooked: boolean;
}

export interface IBookingReq {
  slots: string[];
  email: string;
  phone: string;
  paymentFile: FormData;
  comment?: string;
  lang?: string;
}

export interface IBooking {
  slots: string[];
  email: string;
  phone: string;
  paymentFile: FormData;
  comment?: string;
  isConfirmed: boolean;
}
