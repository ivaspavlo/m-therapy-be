import { LanguageType } from "src/shared/interfaces";

export interface IAdEmailReq {
  lang: LanguageType,
  subject: string,
  title: string,
  message: string,
  url: string,
  img: string
}
