import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';

import { RegisterValidator } from './register.validator';
import { ResponseBody } from '../../models/response-body.model';
import { COLLECTIONS, ERROR_MESSAGES } from '../../constants';


export const RegisterFunction = onRequest(
  // { cors: CORS_URLS },
  async (req: Request, res: Response) => {
    const prospectiveUser = req.body;
    const validationErrors = await RegisterValidator(prospectiveUser);

    if (validationErrors) {
      res.status(400).json(new ResponseBody(null, false, validationErrors));
      return;
    }

    try {
      await getFirestore()
        .collection(COLLECTIONS.USERS)
        .add(prospectiveUser);
    } catch (e: any) {
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      return;
    }

    res.status(200).send(new ResponseBody({}, true));
  }
);
