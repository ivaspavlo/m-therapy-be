import { QueryDocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';
import { ERROR_MESSAGES } from '../../shared/constants';
import { IUser } from '../../shared/interfaces';
import { ILoginReq } from './login.interface';

const bcrypt = require('bcrypt');


export const LoginValidator = async (loginData: ILoginReq, queryByEmail: QuerySnapshot): Promise<string[] | null> => {
  const credentialsError = Promise.resolve([ERROR_MESSAGES.CREDENTIALS]);
  
  if (queryByEmail.empty) {
    return credentialsError;
  }

  const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find(d => !!d);
  if (!userDocumentSnapshot || !userDocumentSnapshot.data()) {
    return credentialsError
  }

  const user: IUser = userDocumentSnapshot.data() as IUser;

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
