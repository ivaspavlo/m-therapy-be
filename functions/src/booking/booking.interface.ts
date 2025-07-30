import { LanguageType } from 'src/shared/interfaces'

export interface IBookingSlot {
  id: string,
  productId: string;
  start: number,
  end: number,
  isBooked: boolean,
  isPreBooked: boolean,
  bookedByEmail?: string
}

export interface IPreBooking {
  bookingSlots: IBookingSlot[],
  email: string,
  lang: LanguageType
}

export interface IProductBooking {
  product: string;
  slots: IBookingSlot[];
}
