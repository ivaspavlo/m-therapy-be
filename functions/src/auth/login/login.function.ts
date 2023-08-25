import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { QuerySnapshot, getFirestore } from 'firebase-admin/firestore';
// import { getAuth } from 'firebase-admin/auth';
import { LoginValidator } from './login.validator';
import { ILoginReq } from './login.interface';
import { COLLECTIONS, ERROR_MESSAGES } from '../../shared/constants';
import { ResponseBody } from '../../shared/models';


export const LoginFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {
    const loginData: ILoginReq = req.body;
    let validationErrors: string[] | null = null;

    try {
      const queryByEmail: QuerySnapshot = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', loginData.email).get();
      validationErrors = LoginValidator(queryByEmail);
    } catch(e: any) {
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      return;
    }

    if (validationErrors) {
      res.status(401).json(new ResponseBody(null, false, validationErrors));
      return;
    }

    // getAuth()
    res.status(200).send(new ResponseBody({}, true));
  }
);
