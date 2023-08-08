export interface IResponseBody<T> {
  data: T,
  success: boolean,
  message?: string
}
