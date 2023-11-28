import { LanguageType } from 'src/shared/interfaces';

export interface IRemindReq {
  email: string,
  lang: LanguageType
}

export interface IMailingData {
  from: string,
  pass: string,
  user: string
}
