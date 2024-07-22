export interface IBookingSlot {
  start: number,
  end: number,
  isBooked: boolean,
  bookedBy?: string
}

export interface IGetBookingReq {
  fromDate: number
}
