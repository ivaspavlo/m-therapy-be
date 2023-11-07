import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { ENV_KEYS } from 'src/shared/constants';
import { ResponseBody } from 'src/shared/models';


export const ManagerFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const jwt = req.headers.authorization;
    res.status(400).send(new ResponseBody({jwt}, true));
  }
);