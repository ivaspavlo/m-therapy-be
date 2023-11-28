import { LanguageType } from "src/shared/interfaces";

export interface IRegisterReq {
  firstname: string,
  lastname: string,
  email: string,
  birthday: number,
  phone: string,
  password: string,
  lang: LanguageType
}
