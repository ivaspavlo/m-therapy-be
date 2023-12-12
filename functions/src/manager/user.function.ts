import * as logger from 'firebase-functions/logger';
import * as jwt from 'jsonwebtoken';
import { onRequest } from 'firebase-functions/v2/https';
import { DocumentData, getFirestore } from 'firebase-admin/firestore';
import { Request, Response } from 'firebase-functions';
import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES } from '../shared/constants';
import { ResponseBody, User } from '../shared/models';
import { IUser } from '../shared/interfaces';


export const UserFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);
    const jwtError = new ResponseBody(null, false, [ERROR_MESSAGES.JWT]);

    const clientJWT = req.headers.authorization;

    if (!clientJWT) {
      res.status(401).json(jwtError);
    }

    try {
      jwt.verify(clientJWT as string, process.env[ENV_KEYS.JWT_SECRET] as string);
    } catch (e: any) {
      res.status(401).json(jwtError);
      return;
    }

    let parsedClientToken: { [key:string]: string, id: string };
    try {
      parsedClientToken = JSON.parse(Buffer.from(clientJWT!.split('.')[1], 'base64').toString());
    } catch (e: any) {
      res.status(401).json(jwtError);
      return;
    }

    let userDocumentData: DocumentData;
    try {
      userDocumentData = (await getFirestore().collection(COLLECTIONS.USERS).doc(parsedClientToken.id).get());
    } catch(e: any) {
      logger.error('[Reset] Querying DB by email failed', e);
      res.status(500).json(generalError);
      return;
    }

    if (!userDocumentData.exists) {
      res.status(400).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_FOUND]));
      return;
    }

    const user: IUser = userDocumentData.data() as IUser;

    logger.info(`Retrieved user data: ${user.id}`);
    res.status(200).send(new ResponseBody(User.fromDocumentData({...user, id: parsedClientToken.id}), true));
  }
);
