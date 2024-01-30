import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response, logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { IProduct } from 'src/shared/interfaces/product.interface';
import { COLLECTIONS, ERROR_MESSAGES } from 'src/shared/constants';
import { ResponseBody } from 'src/shared/models';


export const ProductFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {
    switch(req.method) {
    case('GET'): return getProducts(res);
    // update and delete methods to be implemented
    }
  }
);

async function getProducts(res: Response): Promise<void> {
  try {
    const products: IProduct[] = (await getFirestore().collection(COLLECTIONS.PRODUCTS).get()).docs.map(d => d.data() as IProduct);
    logger.info('[GET PRODUCTS] Retrieval data for products successful');
    res.status(200).json(new ResponseBody(products, true));
  } catch (e: any) {
    logger.error('[GET AD] Retrieval data for ads failed: ', e);
    res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
  }
}
