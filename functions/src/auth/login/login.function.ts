import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { QuerySnapshot, getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { COLLECTIONS, ERROR_MESSAGES } from '../../shared/constants';
import { ResponseBody } from '../../shared/models';
import { LoginValidator } from './login.validator';
import { ILoginReq } from './login.interface';


export const LoginFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {
    const loginData: ILoginReq = req.body;

    let validationErrors: string[] | null = null;
    let queryByEmail: QuerySnapshot;

    try {
      queryByEmail = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', loginData.email).get();
    } catch(e: any) {
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      return;
    }

    validationErrors = await LoginValidator(loginData, queryByEmail);

    if (validationErrors) {
      res.status(401).json(new ResponseBody(null, false, validationErrors));
      return;
    }

    const jwt = await getAuth().createCustomToken(loginData.email);

    res.status(200).send(new ResponseBody({ jwt }, true));
  }
);
