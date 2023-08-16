import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';

import { RegisterValidator } from './register.validator';
import { ResponseBody } from '../../models/response-body.model';
import { COLLECTIONS } from '../../constants';


export const RegisterFunction = onRequest(
  // { cors: CORS_URLS },
  async (req: Request, res: Response) => {
    const prospectiveUser = req.body;
    const validationErrors = RegisterValidator(prospectiveUser);

    if (validationErrors) {
      res.json(new ResponseBody(null, false, validationErrors))
    }

    const createdUser = await getFirestore()
      .collection(COLLECTIONS.USERS)
      .add(prospectiveUser);

    res.json(new ResponseBody(createdUser, true));
  }
);
