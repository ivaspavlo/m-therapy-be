import { QuerySnapshot } from 'firebase-admin/firestore';
import { ERROR_MESSAGES, TRANSLATIONS } from '../shared/constants';
import { IValidationConfig } from '../shared/interfaces';
import {
  birthdayValidator,
  booleanValidator,
  emailValidator,
  langFieldValidator,
  maxCharQty,
  minCharQty,
  stringValidator,
  validate
} from '../shared/utils';
import { ISubscriber, IUpdateUser } from './user.interface';


const subscriberValidators: Record<keyof ISubscriber, IValidationConfig> = {
  email: {validators: [stringValidator, emailValidator]}
}

const userUpdateValidators: Record<keyof IUpdateUser, IValidationConfig> = {
  firstname: {isOptional: true, validators: [minCharQty(3), maxCharQty(20)]},
  lastname: {isOptional: true, validators: [minCharQty(3), maxCharQty(20)]},
  email: {isOptional: true, validators: [emailValidator]},
  birthday: {isOptional: true, validators: [birthdayValidator]},
  phone: {isOptional: true, validators: [minCharQty(9), maxCharQty(15)]},
  lang: {isOptional: true, validators: [stringValidator, langFieldValidator(TRANSLATIONS)]},
  hasEmailConsent: {isOptional: true, validators: [booleanValidator]}
}

export const UserUpdateValidator = (data: IUpdateUser): string[] | null => {
  const errors = validate(data, userUpdateValidators);
  if (errors.length) {
    return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  }
  return null;
}

export const SubscriberValidator = (data: ISubscriber, queryByEmail: QuerySnapshot): string[] | null => {
  if (!queryByEmail.empty) {
    return [ERROR_MESSAGES.DUPLICATE];
  }
  const errors = validate(data, subscriberValidators);
  return errors.length
    ? [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`]
    : null;
}
