import { defineInt } from 'firebase-functions/params';
import { IRegisterReq } from './register.interface';
import { IUser } from '../../shared/interfaces';
import { ENV_KEYS } from '../../shared/constants';

const bcrypt = require('bcrypt');
const xss = require('xss');
const saltRounds = defineInt(ENV_KEYS.SALT_ROUNDS);


export const RegisterMapper = async (req: IRegisterReq): Promise<IUser> => {
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
    firstname: xss(req.firstname),
    lastname: xss(req.lastname),
    email: xss(req.email),
    phone: xss(req.phone),
    birthday: req.birthday,
    password: hashedPassword,
    isAdmin: false,
    created: Date.now()
  };
}
