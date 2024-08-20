import { LanguageType } from 'src/shared/interfaces'

export interface IBookingSlot {
  id: string,
  start: number,
  end: number,
  isBooked: boolean,
  isPreBooked: boolean,
  bookedBy?: string
}

export interface IBookingReq {
  bookingSlots: IBookingSlot[],
  email: string,
  language: LanguageType
}
