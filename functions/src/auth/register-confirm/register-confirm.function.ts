import * as logger from 'firebase-functions/logger';
import * as jwt from 'jsonwebtoken';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { QueryDocumentSnapshot, QuerySnapshot, getFirestore } from 'firebase-admin/firestore';
import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES } from '../../shared/constants';
import { ResponseBody } from '../../shared/models';
import { IUser } from '../../shared/interfaces';


export const RegisterConfirmFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);
    const resetToken: string = req.query.token as string;

    try {
      jwt.verify(resetToken, process.env[ENV_KEYS.JWT_SECRET] as string);
    } catch (e: any) {
      res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.JWT]));
      return;
    }

    let parsedResetToken: { [key:string]: string, email: string };
    try {
      parsedResetToken = JSON.parse(Buffer.from(resetToken.split('.')[1], 'base64').toString());
    } catch (e: any) {
      res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.JWT]));
      return;
    }

    let queryByEmail: QuerySnapshot;
    try {
      queryByEmail = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', parsedResetToken.email).get();
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
