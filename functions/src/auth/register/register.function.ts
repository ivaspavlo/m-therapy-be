import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { DocumentReference, QuerySnapshot, getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { ResponseBody } from '../../shared/models';
import { COLLECTIONS, ERROR_MESSAGES } from '../../shared/constants';
import { RegisterValidator } from './register.validator';
import { IRegisterReq } from './register.interface';
import { RegisterMapper } from './register.mapper';


export const RegisterFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {
    const userData: IRegisterReq = req.body;
    const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);
    
    let validationErrors: string[] | null = null;
    let existingUser: QuerySnapshot;

    try {
      existingUser = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', userData.email).get();
    } catch(e: any) {
      logger.error('Querying DB by email failed', e);
      res.status(500).json(generalError);
      return;
    }

    validationErrors = RegisterValidator(userData, existingUser);
    if (validationErrors) {
      res.status(400).json(new ResponseBody(null, false, validationErrors));
      return;
    }

    let prospectiveUser;

    try {
      prospectiveUser = await RegisterMapper(userData);
    } catch (e: any) {
      logger.error('Hashing of password failed', e);
      res.status(500).json(generalError);
      return;
    }

    let userDocumentReference: DocumentReference;
    try {
      userDocumentReference = await getFirestore()
        .collection(COLLECTIONS.USERS)
        .add(prospectiveUser);
    } catch (e: any) {
      logger.error('Storing of user data failed', e);
      res.status(500).json(generalError);
      return;
    }

    logger.info(`Created user: ${userDocumentReference.id}`);

    res.status(201).send(new ResponseBody({}, true));
  }
);
