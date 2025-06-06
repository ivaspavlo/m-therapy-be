import { ERROR_MESSAGES } from '../../shared/constants';
import { IUser } from '../../shared/interfaces';
import { ILoginReq } from './login.interface';

const bcrypt = require('bcrypt');


export const LoginValidator = async (req: ILoginReq, user: IUser): Promise<string[] | null> => {
  let isPasswordCorrect: boolean;

  if (!user.isConfirmed) {
    return Promise.resolve([ERROR_MESSAGES.BAD_DATA]);
  }

  try {
    isPasswordCorrect = await bcrypt.compare(req.password, user.password);
  } catch (e: any) {
    return Promise.resolve([ERROR_MESSAGES.GENERAL]);
  }

  if (!isPasswordCorrect) {
    return Promise.resolve([ERROR_MESSAGES.CREDENTIALS]);
  }

  return null;
}
