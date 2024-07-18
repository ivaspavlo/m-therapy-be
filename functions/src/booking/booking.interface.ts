export interface IBookingSlot {
  start: number,
  end: number,
  isBooked: boolean
}

export interface IGetBookingReq {
  fromDate: number
}
