import { IRemindReq } from './remind.interface';
import { emailValidator, langFieldValidator, validate } from '../../shared/utils';
import { ERROR_MESSAGES, TRANSLATIONS } from '../../shared/constants';


const fieldValidators: Record<keyof IRemindReq, Function[]> = {
  email: [emailValidator],
  lang: [langFieldValidator(TRANSLATIONS)]
}

export const RemindValidator = (req: IRemindReq): string[] | null => {
  const errors = validate(req, fieldValidators);

  if (errors.length) {
    return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  }

  return null;
}
