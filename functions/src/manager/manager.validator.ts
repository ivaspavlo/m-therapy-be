import { langFieldValidator, stringValidator, validate } from '../shared/utils';
import { ERROR_MESSAGES, TRANSLATIONS } from '../shared/constants';
import { IAdEmailsReq } from './manager.interface';


const fieldValidators: Record<keyof IAdEmailsReq, Function[]> = {
  lang: [langFieldValidator(TRANSLATIONS)],
  subject: [stringValidator],
  title: [stringValidator],
  message: [stringValidator],
  url: [stringValidator],
  img: [stringValidator]
}

export const ManagerValidator = (req: IAdEmailsReq): string[] | null => {
  const errors = validate(req, fieldValidators);

  if (errors.length) {
    return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  }

  return null;
}