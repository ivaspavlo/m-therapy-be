import { langFieldValidator, stringValidator, validate } from '../shared/utils';
import { ERROR_MESSAGES, TRANSLATIONS } from '../shared/constants';
import { IAdEmailsReq } from './manager.interface';
import { IValidationConfig } from '../shared/interfaces';


const fieldValidators: Record<keyof IAdEmailsReq, IValidationConfig> = {
  lang: {validators: [langFieldValidator(TRANSLATIONS)]},
  subject: {validators: [stringValidator]},
  title: {validators: [stringValidator]},
  message: {validators: [stringValidator]},
  url: {validators: [stringValidator]},
  img: {validators: [stringValidator]}
}

export const ManagerValidator = (req: IAdEmailsReq): string[] | null => {
  const errors = validate(req, fieldValidators);

  if (errors.length) {
    return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  }

  return null;
}
