import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { QueryDocumentSnapshot, QuerySnapshot, getFirestore } from 'firebase-admin/firestore';
import { COLLECTIONS, ERROR_MESSAGES } from '../../shared/constants';
import { IResetReq } from './reset.interface';
import { ResponseBody } from '../../shared/models';
import { IUser } from '../../shared/interfaces';


export const ResetFunction = onRequest(
  // { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const resetToken: string = req.query.token as string;
    const resetData: IResetReq = req.body;

    let parsedResetToken: { [key:string]: string, email: string };
    try {
      parsedResetToken = JSON.parse(Buffer.from(resetToken.split('.')[1], 'base64').toString());
    } catch (e: any) {
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      return;
    }

    let queryByEmail: QuerySnapshot;
    try {
      queryByEmail = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', parsedResetToken.email).get();
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

    res.status(200).send(new ResponseBody({}, true));
  }
);
