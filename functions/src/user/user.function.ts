import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { DocumentReference, DocumentSnapshot, getFirestore } from 'firebase-admin/firestore';
import { Request, Response } from 'firebase-functions';
import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES } from '../shared/constants';
import { ResponseBody, User } from '../shared/models';
import { IUser } from '../shared/interfaces';
import { extractJwt } from '../shared/utils';
import { IUpdateUser } from './user.interface';
import { SubscriberValidator, UserUpdateValidator } from './user.validatior';
import { SubscriberMapper, UpdateUserMapper } from './user.mapper';


export const UserFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    switch(req.method) {
    case('GET'): return getUser(req, res);
    case('PUT'): return putUser(req, res);
    case('POST'): return postUser(req, res);
    }
  }
);

async function getUser(
  req: Request,
  res: Response
): Promise<any> {
  const jwtToken = extractJwt<{[key:string]: string, id: string} | null>(
    req.headers.authorization as string,
    process.env[ENV_KEYS.JWT_SECRET] as string
  );
  if (!jwtToken) {
    res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.JWT]));
    return;
  }
  let userDocumentSnapshot: DocumentSnapshot;
  try {
    userDocumentSnapshot = (await getFirestore().collection(COLLECTIONS.USERS).doc(jwtToken!.id).get());
  } catch(e: any) {
    logger.error('[GET USER] Querying DB user id failed', e);
    res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
    return;
  }
  if (!userDocumentSnapshot.exists) {
    res.status(400).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_FOUND]));
    return;
  }
  const user: IUser = userDocumentSnapshot.data() as IUser;
  logger.info(`[GET USER] Retrieved user with id: ${userDocumentSnapshot.id}`);
  res.status(200).send(new ResponseBody(User.fromDocumentData({...user, id: userDocumentSnapshot.id}), true));
}

async function putUser(
  req: Request,
  res: Response
): Promise<any> {
  const jwtToken = extractJwt<{[key:string]: string, id: string} | null>(
    req.headers.authorization as string,
    process.env[ENV_KEYS.JWT_SECRET] as string
  );
  if (!jwtToken) {
    res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.JWT]));
    return;
  }
  let userDocumentSnapshot: DocumentSnapshot;
  try {
    userDocumentSnapshot = (await getFirestore().collection(COLLECTIONS.USERS).doc(jwtToken!.id).get());
  } catch(e: any) {
    logger.error('[PUT USER] Querying DB user id failed', e);
    res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
    return;
  }
  if (!userDocumentSnapshot.exists) {
    res.status(400).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_FOUND]));
    return;
  }

  const rawUpdateData: IUpdateUser = req.body;

  const validationErrors = UserUpdateValidator(rawUpdateData);
  if (validationErrors) {
    res.status(400).json(new ResponseBody(null, false, validationErrors));
    return;
  }

  const formattedUpdateData: Partial<User> = UpdateUserMapper(
    rawUpdateData,
    userDocumentSnapshot.data() as User
  );

  try {
    await userDocumentSnapshot.ref.update(formattedUpdateData);
  } catch (e: any) {
    logger.error('[PUT USER] Update of user data failed', e);
    res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
    return;
  }

  logger.info(`[PUT USER] Updated user with id: ${userDocumentSnapshot.id}`);
  res.status(200).send(new ResponseBody(userDocumentSnapshot.data(), true));
}

async function postUser(
  req: Request,
  res: Response
): Promise<any> {
  switch(req.url) {
  case('/subscribe'): {
    const reqBody: any = req.body;

    const validationErrors = SubscriberValidator(reqBody);
    if (validationErrors) {
      res.status(400).json(new ResponseBody(null, false, validationErrors));
      return;
    }

    const subscriber = SubscriberMapper(reqBody);

    let subscriberReference: DocumentReference;
    try {
      subscriberReference = await getFirestore()
        .collection(COLLECTIONS.SUBSCRIBERS)
        .add(subscriber);
    } catch (e: any) {
      logger.error('[POST USER SUBSCRIBE] Storing of subscriber data failed', e);
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      return;
    }

    logger.info(`[POST USER SUBSCRIBE] Created subscriber: ${subscriberReference.id}`);

    res.status(200).send(new ResponseBody(subscriber, true));
  }
  }

}
