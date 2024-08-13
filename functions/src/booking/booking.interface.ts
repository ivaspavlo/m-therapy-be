export interface IBookingSlot {
  id: string,
  start: number,
  end: number,
  isBooked: boolean,
  preBookedDate?: number,
  bookedBy?: string
}

export interface IBookingReq {
  bookingSlots: IBookingSlot[],
  email: string
}
