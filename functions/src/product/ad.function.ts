import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { COLLECTIONS, ENV_KEYS } from '../shared/constants';
import { ResponseBody } from '../shared/models';
import { getFirestore } from 'firebase-admin/firestore';


export const AdFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const test = await getFirestore().collection(COLLECTIONS.ADS).get();
    console.log(test);
    res.status(200).send(new ResponseBody([], true));
  }
);
