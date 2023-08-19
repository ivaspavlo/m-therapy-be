import { IResponseBody } from '../../shared/interfaces';


export class ResponseBody<T> implements IResponseBody<T> {
  public data!: T;
  public success: boolean = true;
  public message?: string[];

  constructor(
    data: T,
    success: boolean,
    message?: string[]
  ) {
    this.data = data;
    this.success = success;
    this.message = message;
  }
}
