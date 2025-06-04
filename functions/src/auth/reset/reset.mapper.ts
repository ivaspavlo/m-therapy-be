import { IUser } from '../../shared/interfaces';
import { IResetReq } from './reset.interface';
import { ENV_KEYS } from '../../shared/constants';

const bcrypt = require('bcrypt');

export const ResetMapper = async (req: IResetReq, user: IUser): Promise<IUser> => {
  const saltRounds = process.env[ENV_KEYS.SALT_ROUNDS];

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.password, saltRounds);
  } catch (e: any) {
    return Promise.reject();
  }

  if (!hashedPassword) {
    return Promise.reject();
  }

  return {
    ...user,
    password: hashedPassword
  }
}
