export interface IUser {
  id?: string,
  created?: number,
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  birthday: number,
  password: string,
  isAdmin: boolean,
  isConfirmed: boolean,
  hasEmailConsent: boolean,
  lang: string
}
