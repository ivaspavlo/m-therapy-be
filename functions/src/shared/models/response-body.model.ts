import { IResponseBody } from '../../shared/interfaces';
import { RESPONSE_STATUS } from '../constants';


export class ResponseBody<T> implements IResponseBody<T> {
  public data!: T;
  public success: boolean = true;
  public message?: string[];
  public status?: RESPONSE_STATUS;

  constructor(
    data: T,
    success: boolean,
    message?: string[],
    status?: RESPONSE_STATUS
  ) {
    this.data = data;
    this.success = success;
    this.message = message;
    this.status = status;
  }
}
