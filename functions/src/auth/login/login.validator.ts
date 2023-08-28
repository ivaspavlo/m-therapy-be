import { ERROR_MESSAGES } from '../../shared/constants';
import { IUser } from '../../shared/interfaces';
import { ILoginReq } from './login.interface';

const bcrypt = require('bcrypt');


export const LoginValidator = async (loginData: ILoginReq, user: IUser): Promise<string[] | null> => {
  const credentialsError = Promise.resolve([ERROR_MESSAGES.CREDENTIALS]);

  let isPasswordCorrect: boolean;
  try {
    isPasswordCorrect = await bcrypt.compare(loginData.password, user.password);
  } catch (e: any) {
    return credentialsError
  }

  if (!isPasswordCorrect) {
    return credentialsError
  }

  return null;
}
