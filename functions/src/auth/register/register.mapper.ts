import { defineInt } from 'firebase-functions/params';
import { IRegisterReq } from './register.interface';
import { User } from '../../shared/models';

const bcrypt = require('bcrypt');
const saltRounds = defineInt('SALT_ROUNDS');


export const RegisterMapper = async (req: IRegisterReq): Promise<any> => {
  const hashedPassword = await bcrypt.hash(req.password, saltRounds.value());

  if (!hashedPassword) {
    return Promise.reject();
  }

  return new User(
    req.firstname,
    req.lastname,
    req.email,
    req.phone,
    req.birthday,
    hashedPassword
  );
}
