import { IBookingSlot } from '../../booking/booking.interface'
import { IProduct } from './product.interface'

export interface IEmailTemplate<T> {
  lang?: string,
  to: string,
  subject: string,
  title: string,
  message: string,
  config: T
}

export interface IAdEmail {
  url: string,
  img: string,
  unsubscribeUrl: string
}

export interface IRemindPasswordEmail {
  url: string
}

export interface IRegisterEmail {
  url: string
}

export interface IConfirmBookingEmail {
  url: string
}

export interface IAdminNotificationTemplateData {
  adminEmailAddress: string;
  products: IProduct[];
  bookings: IBookingSlot[];
  email: string;
  phone: string;
  name: string;
  confirmLink: string;
  comment?: string;
}
