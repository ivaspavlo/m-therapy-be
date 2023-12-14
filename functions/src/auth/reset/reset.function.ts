import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { QueryDocumentSnapshot, QuerySnapshot, getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import * as jwt from 'jsonwebtoken';
import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES } from '../../shared/constants';
import { ResponseBody } from '../../shared/models';
import { IUser } from '../../shared/interfaces';
import { IResetReq } from './reset.interface';
import { ResetValidator } from './reset.validator';
import { ResetMapper } from './reset.mapper';


export const ResetFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);
    const resetToken: string = req.query.token as string;
    const resetData: IResetReq = req.body;

    try {
      jwt.verify(resetToken, process.env[ENV_KEYS.JWT_SECRET] as string);
    } catch (e: any) {
      res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.JWT]));
      return;
    }

    const validationErrors: string[] | null = await ResetValidator(resetData);
    if (validationErrors) {
      res.status(401).json(new ResponseBody(null, false, validationErrors));
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
      logger.error('[Reset] Querying DB by email failed', e);
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

    let updatedUser: IUser;
    try {
      updatedUser = await ResetMapper(resetData, user);
    } catch (e: any) {
      logger.error('[Reset] Hashing of password failed', e);
      res.status(500).json(generalError);
      return;
    }

    try {
      userDocumentSnapshot.ref.update({
        ...updatedUser
      });
    } catch (e: any) {
      logger.error('[Reset] Updating of user data failed', e);
      res.status(500).json(generalError);
      return;
    }

    logger.info(`[Reset] Password updated for user: ${userDocumentSnapshot.id}`);
    res.status(200).send(new ResponseBody({}, true));
  }
);
