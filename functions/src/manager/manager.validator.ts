// import { langFieldValidator, validate } from '../../shared/utils';
// import { ERROR_MESSAGES, TRANSLATIONS } from '../../shared/constants';
import { IAdEmailReq } from './manager.interface';


// const fieldValidators: Record<keyof IAdEmailReq, Function[]> = {
//   email: [emailValidator],
//   lang: [langFieldValidator(TRANSLATIONS)]
// }

export const ManagerValidator = (req: IAdEmailReq): string[] | null => {
  // const errors = validate(req, fieldValidators);

  // if (errors.length) {
  //   return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  // }

  return null;
}