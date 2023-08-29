import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { ResponseBody } from '../../shared/models';

export const RemindFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {
    

    res.status(201).send(new ResponseBody({}, true));
  }
);
