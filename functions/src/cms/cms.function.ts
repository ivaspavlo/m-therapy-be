import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response, logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { IProduct } from '../shared/interfaces/product.interface';
import { ERROR_MESSAGES } from '../shared/constants';
import { ResponseBody } from '../shared/models';

export const CmsFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {
    switch(req.method) {
    case('GET'): return getProducts(res);
    // update and delete methods to be implemented
    }
  }
);

async function getProducts(res: Response): Promise<void> {
  try {
    const products: IProduct[] = (await getFirestore().collection('COLLECTIONS.PRODUCTS').get()).docs.map(d => d.data() as IProduct);
    logger.info('[GET CMS DATA] Retrieval CMS data successful');
    res.status(200).json(new ResponseBody(products, true));
  } catch (e: any) {
    logger.error('[GET CMS DATA] Retrieval CMS data failed: ', e);
    res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
  }
}
