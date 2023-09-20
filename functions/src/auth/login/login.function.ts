import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { defineString } from 'firebase-functions/params';
import { QueryDocumentSnapshot, QuerySnapshot, getFirestore } from 'firebase-admin/firestore';

import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES } from '../../shared/constants';
import { ResponseBody } from '../../shared/models';
import { IUser } from '../../shared/interfaces';

import { LoginValidator } from './login.validator';
import { ILoginReq } from './login.interface';

const jwt = require('jsonwebtoken');

const jwtExp = defineString(ENV_KEYS.JWT_EXP);


export const LoginFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
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

    if (queryByEmail.empty) {
      res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.CREDENTIALS]));
      return;
    }
  
    const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find(d => !!d);
    if (!userDocumentSnapshot || !userDocumentSnapshot.data()) {
      res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.CREDENTIALS]));
      return;
    }
  
    const user: IUser = userDocumentSnapshot.data() as IUser;

    validationErrors = await LoginValidator(loginData, user);

    if (validationErrors) {
      res.status(401).json(new ResponseBody(null, false, validationErrors));
      return;
    }

    let jwtToken = null;
    try {
      jwtToken = jwt.sign({ id: userDocumentSnapshot.id }, process.env[ENV_KEYS.JWT_SECRET], { expiresIn: jwtExp.value() });
    } catch (e: any) {
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      return;
    }

    res.status(200).send(new ResponseBody({ jwtToken, id: userDocumentSnapshot.id }, true));
  }
);
