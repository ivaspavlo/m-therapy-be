import { stringValidator, validate } from '../shared/utils';
import { ERROR_MESSAGES } from '../shared/constants';
import { ISubscriber } from './user.interface';
import { IUser, IValidationConfig } from '../shared/interfaces';


const subscriberValidators: Record<keyof ISubscriber, IValidationConfig> = {
  email: {validators: [stringValidator]}
}

export const UserUpdateValidator = (data: Partial<IUser> = {}, user: IUser): string[] | null => {
  return null;
}

export const SubscriberValidator = (data: ISubscriber): string[] | null => {
  const errors = validate(data, subscriberValidators);
  if (errors.length) {
    return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  }
  return null;
}
