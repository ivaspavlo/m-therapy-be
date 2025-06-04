import { IRegisterReq } from './register.interface';
import { IUser } from '../../shared/interfaces';
import { ENV_KEYS } from '../../shared/constants';

const bcrypt = require('bcrypt');
const xss = require('xss');

export const RegisterMapper = async (req: IRegisterReq): Promise<IUser> => {
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
    firstname: xss(req.firstname),
    lastname: xss(req.lastname),
    email: xss(req.email),
    phone: xss(req.phone),
    birthday: req.birthday,
    password: hashedPassword,
    hasEmailConsent: req.hasEmailConsent,
    isAdmin: false,
    isConfirmed: false,
    lang: req.lang,
    created: Date.now()
  };
}
