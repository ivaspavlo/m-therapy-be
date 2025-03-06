export interface IPaymentCard {
  name: string;
  number: string;
}

export interface IPaymentData {
  cards: IPaymentCard[]
}
