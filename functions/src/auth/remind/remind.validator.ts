import { IRemindReq } from './remind.interface';
import { emailValidator, langFieldValidator, validate } from '../../shared/utils';
import { ERROR_MESSAGES, TRANSLATIONS } from '../../shared/constants';
import { IValidationConfig } from '../../shared/interfaces';


const fieldValidators: Record<keyof IRemindReq, IValidationConfig> = {
  email: {validators: [emailValidator]},
  lang: {validators: [langFieldValidator(TRANSLATIONS)]}
}

export const RemindValidator = (req: IRemindReq): string[] | null => {
  const errors = validate(req, fieldValidators);
  if (errors.length) {
    return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  }
  return null;
}
