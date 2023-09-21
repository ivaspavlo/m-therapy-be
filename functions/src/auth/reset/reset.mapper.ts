import { defineInt } from 'firebase-functions/params';
import { IUser } from '../../shared/interfaces';
import { IResetReq } from './reset.interface';
import { ENV_KEYS } from '../../shared/constants';

const bcrypt = require('bcrypt');


const saltRounds = defineInt(ENV_KEYS.SALT_ROUNDS);

export const ResetMapper = async (req: IResetReq, user: IUser): Promise<IUser> => {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.password, saltRounds.value());
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
