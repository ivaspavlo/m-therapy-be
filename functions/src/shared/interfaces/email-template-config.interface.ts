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
  img: string
}

export interface IRemindPasswordEmail {
  url: string
}

export interface IRegisterEmail {
  url: string
}
