import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { ENV_KEYS, ERROR_MESSAGES } from '../shared/constants';
import { ResponseBody } from '../shared/models';
import * as logger from 'firebase-functions/logger';
import * as jwt from 'jsonwebtoken';

export const ManagerFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const clientJWT = req.headers.authorization;
    try {
      jwt.verify(clientJWT as string, process.env[ENV_KEYS.JWT_SECRET] as string);
    } catch (e: any) {
      res.status(401).json(new ResponseBody(null, false, [ERROR_MESSAGES.JWT]));
      return;
    }

    logger.info("Retrieved resource");
    res.status(200).send(new ResponseBody({jwt}, true));
  }
);
