import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { DocumentData, getFirestore } from 'firebase-admin/firestore';
import { Request, Response } from 'firebase-functions';
import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES } from '../shared/constants';
import { ResponseBody, User } from '../shared/models';
import { IUser } from '../shared/interfaces';
import { extractJwt } from '../shared/utils';


export const UserFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);

    const jwtToken = extractJwt<{[key:string]: string, id: string} | null>(
      req.headers.authorization as string,
      process.env[ENV_KEYS.JWT_SECRET] as string
    );
    if (!jwtToken) {
      res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.JWT]));
      return;
    }

    let userDocumentData: DocumentData;
    try {
      userDocumentData = (await getFirestore().collection(COLLECTIONS.USERS).doc(jwtToken!.id).get());
    } catch(e: any) {
      logger.error('[GET USER] Querying DB by email failed', e);
      res.status(500).json(generalError);
      return;
    }

    if (!userDocumentData.exists) {
      res.status(400).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_FOUND]));
      return;
    }

    const user: IUser = userDocumentData.data() as IUser;

    switch(req.method) {
    case('GET'): return getUser(res, userDocumentData.id, user);
    case('PUT'): return updateUser(res, userDocumentData.id, user);
    }
  }
);

async function getUser(res: Response, id: string, user: IUser): Promise<any> {
  logger.info(`[GET USER] Retrieved user data: ${id}`);
  res.status(200).send(new ResponseBody(User.fromDocumentData({...user, id}), true));
}

async function updateUser(res: Response, id: string, user: IUser): Promise<any> {
  logger.info(`[PUT USER] Retrieved user data: ${id}`);
  res.status(200).send(new ResponseBody(User.fromDocumentData({...user, id}), true));
}
