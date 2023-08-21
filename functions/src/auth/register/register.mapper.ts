import * as bcrypt from 'bcryptjs';
import { IRegisterReq } from './register.interface';
import { User } from '../../shared/models';


export const RegisterMapper = async (req: IRegisterReq): Promise<any> => {
  const hashedPassword = await new Promise<string | null>((resolve) => {
    bcrypt.hash(req.password, bcrypt.getSalt('test'), (err: any, hash: string) => {
      if (err) {
        resolve(null);
      }
      resolve(hash);
    });
  });

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
