import { defineInt } from 'firebase-functions/params';
import { IRegisterReq } from './register.interface';
import { IUser } from '../../shared/interfaces';
import { ENV_KEYS } from '../../shared/constants';

const bcrypt = require('bcrypt');
const xss = require('xss');
const saltRounds = defineInt(ENV_KEYS.SALT_ROUNDS);


export const RegisterMapper = async (req: IRegisterReq): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(req.password, saltRounds.value());

  if (!hashedPassword) {
    return Promise.reject();
  }

  const user: IUser = {
    firstname: xss(req.firstname),
    lastname: xss(req.lastname),
    email: xss(req.email),
    phone: xss(req.phone),
    birthday: req.birthday,
    password: hashedPassword,
    isAdmin: false,
    created: Date.now()
  };

  return user;
}
