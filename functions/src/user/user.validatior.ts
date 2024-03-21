import { stringValidator, validate } from '../shared/utils';
import { ERROR_MESSAGES } from '../shared/constants';
import { ISubscriber } from './user.interface';
import { IUser } from 'src/shared/interfaces';


const subscriberValidators: Record<keyof ISubscriber, Function[]> = {
  email: [stringValidator]
}

export const UserUpdateValidator = (data: Partial<IUser> = {}): string[] | null => {
  console.log(data);
  return null;
}

export const SubscriberValidator = (data: ISubscriber): string[] | null => {
  const errors = validate(data, subscriberValidators);
  if (errors.length) {
    return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  }
  return null;
}
