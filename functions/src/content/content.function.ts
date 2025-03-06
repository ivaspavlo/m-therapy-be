import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response, logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';

import { COLLECTIONS, ERROR_MESSAGES } from '../shared/constants';
import { Ad, ResponseBody } from '../shared/models';
import { IProduct, IAd, IContact, IPaymentData } from '../shared/interfaces';

export const ContentFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {
    switch(req.method) {
    case('GET'): return getContent(res);
    // update and delete methods to be implemented
    }
  }
);

async function getContent(res: Response): Promise<void> {
  try {
    const products: IProduct[] = (await getFirestore().collection(COLLECTIONS.PRODUCTS).get()).docs.map(d => d.data() as IProduct);
    const ads: IAd[] = (await getFirestore().collection(COLLECTIONS.ADS).get()).docs.map(d => Ad.of(d.data() as IAd)) as IAd[];
    const contacts: IContact[] = (await getFirestore().collection(COLLECTIONS.CONTACTS).get()).docs.map(d => d.data() as IContact);
    const paymentData: IPaymentData[] = (await getFirestore().collection(COLLECTIONS.PAYMENT).get()).docs.map(d => d.data() as IPaymentData);

    logger.info('[GET CONTENT] Retrieved successfully');
    res.status(200).json(new ResponseBody({products, ads, contacts, paymentData}, true));
  } catch (e: any) {
    logger.error('[GET CONTENT] Retrieval failed: ', e);
    res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
  }
}
