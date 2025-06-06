import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'express';
import { QueryDocumentSnapshot, QuerySnapshot, getFirestore } from 'firebase-admin/firestore';

import { COLLECTIONS, ENV_SECRETS, ERROR_MESSAGES } from '../../shared/constants';
import { ResponseBody } from '../../shared/models';
import { IUser } from '../../shared/interfaces';
import { extractJwt } from '../../shared/utils';

export const RegisterConfirmFunction = onRequest(
  { secrets: [ENV_SECRETS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);
    const jwtError = new ResponseBody(null, false, [ERROR_MESSAGES.JWT]);

    const jwtToken = extractJwt<{[key:string]: string} | null>(
      req.query.token as string,
      process.env[ENV_SECRETS.JWT_SECRET]!
    );

    if (!jwtToken) {
      res.status(401).json(jwtError);
      return;
    }

    let queryByEmail: QuerySnapshot;
    try {
      queryByEmail = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', jwtToken!.email).get();
    } catch(e: any) {
      logger.error('[REGISTER_CONFIRM] Querying DB by email failed', e);
      res.status(500).json(generalError);
      return;
    }

    if (queryByEmail.empty) {
      res.status(400).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_FOUND]));
      return;
    }

    const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find(d => !!d);
    if (!userDocumentSnapshot || !userDocumentSnapshot.data()) {
      res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.CREDENTIALS]));
      return;
    }

    const user: IUser = userDocumentSnapshot.data() as IUser;

    try {
      userDocumentSnapshot.ref.update({
        ...user,
        isConfirmed: true
      });
    } catch (e: any) {
      logger.error('[REGISTER_CONFIRM] Registration confirm failed for user: ', user.id);
      res.status(500).json(generalError);
      return;
    }

    logger.info(`[REGISTER_CONFIRM] Registration confirmed for a user: ${userDocumentSnapshot.id}`);
    res.status(200).send(new ResponseBody({}, true));
  }
);
