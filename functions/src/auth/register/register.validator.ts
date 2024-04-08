import { QuerySnapshot } from 'firebase-admin/firestore';
import { IRegisterReq } from './register.interface';
import { ERROR_MESSAGES, TRANSLATIONS } from '../../shared/constants';
import {
  birthdayValidator,
  booleanValidator,
  emailValidator,
  langFieldValidator,
  maxCharQty,
  minCharQty,
  passwordValidator,
  stringValidator,
  validate
} from '../../shared/utils';
import { IValidationConfig } from '../../shared/interfaces';


const fieldValidators: Record<keyof IRegisterReq, IValidationConfig> = {
  firstname: {validators: [minCharQty(3), maxCharQty(20)]},
  lastname: {validators: [minCharQty(3), maxCharQty(20)]},
  email: {validators: [emailValidator]},
  birthday: {validators: [birthdayValidator]},
  phone: {validators: [minCharQty(9), maxCharQty(15)]},
  password: {validators: [passwordValidator]},
  lang: {validators: [stringValidator, langFieldValidator(TRANSLATIONS)]},
  hasEmailConsent: {validators: [booleanValidator]}
}

export const RegisterValidator = (req: IRegisterReq, queryByEmail: QuerySnapshot): string[] | null => {
  if (!queryByEmail.empty) {
    return [ERROR_MESSAGES.DUPLICATE];
  }
  const errors = validate(req, fieldValidators);
  if (errors.length) {
    return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  }
  return null;
}
