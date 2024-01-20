import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES } from '../shared/constants';
import { ResponseBody } from '../shared/models';
import { IAd } from '../shared/interfaces';


export const AdFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    try {
      const ads: IAd[] = (await getFirestore().collection(COLLECTIONS.ADS).get()).docs.map(d => d.data()) as IAd[];
      logger.info('[Ads] Retrieval data for ads successful');
      res.status(200).send(new ResponseBody(ads, true));
    } catch (e: any) {
      logger.error('[Ads] Retrieval data for ads failed: ', e);
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
    }
  }
);
