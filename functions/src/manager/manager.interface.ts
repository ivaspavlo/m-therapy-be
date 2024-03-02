import { LanguageType } from "src/shared/interfaces";

export interface IAdEmailsReq {
  lang: LanguageType,
  subject: string,
  title: string,
  message: string,
  url: string,
  img: string
}

export interface IAdEmailsRes {
  allSent: boolean,
  notSent: string[]
}
