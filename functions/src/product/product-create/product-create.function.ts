import { onRequest } from 'firebase-functions/v2/https';
import { ENV_KEYS } from 'src/shared/constants';
import { Request, Response } from 'firebase-functions';


export const ProductCreateFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    
  }
);
