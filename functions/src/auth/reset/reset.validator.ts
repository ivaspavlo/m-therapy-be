import { ERROR_MESSAGES } from '../../shared/constants';
import { IUser } from '../../shared/interfaces';
import { passwordValidator, stringValidator, validate } from '../../shared/utils';
import { IResetReq } from './reset.interface';

const bcrypt = require('bcrypt');


const fieldValidators: Record<keyof IResetReq, Function[]> = {
  password: [passwordValidator],
  oldPassword: [stringValidator]
}

export const ResetValidator = async (req: IResetReq, user: IUser): Promise<string[] | null> => {
  const errors = validate(req, fieldValidators);
  if (errors.length) {
    return Promise.resolve([`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`]);
  }

  let isPasswordCorrect: boolean;
  try {
    isPasswordCorrect = await bcrypt.compare(req.oldPassword, user.password);
  } catch (e: any) {
    return Promise.resolve([ERROR_MESSAGES.GENERAL]);
  }

  if (!isPasswordCorrect) {
    return Promise.resolve([ERROR_MESSAGES.CREDENTIALS]);
  }

  return null;
}
