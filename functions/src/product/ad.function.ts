import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { COLLECTIONS, ERROR_MESSAGES } from '../shared/constants';
import { Ad, ResponseBody } from '../shared/models';
import { IAd } from '../shared/interfaces';


export const AdFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {
    switch(req.method) {
    case('GET'): return getAds(res);
    // update and delete methods to be implemented
    }
  }
);

async function getAds(res: Response): Promise<void> {
  try {
    const ads: IAd[] = (await getFirestore().collection(COLLECTIONS.ADS).get()).docs.map(
      d => Ad.of(d.data() as IAd)
    ) as IAd[];
    logger.info('[GET AD] Retrieval data for ads successful');
    res.status(200).json(new ResponseBody(ads, true));
  } catch (e: any) {
    logger.error('[GET AD] Retrieval data for ads failed: ', e);
    res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
  }
}
