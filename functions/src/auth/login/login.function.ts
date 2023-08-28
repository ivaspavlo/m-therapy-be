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
const jwtSecret = defineString(ENV_KEYS.JWT_SECRET).value();
const jwtExp = defineString(ENV_KEYS.JWT_EXP).value();


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

    const jwtToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: jwtExp });

    res.status(200).send(new ResponseBody({ jwtToken, id: user.id }, true));
  }
);
