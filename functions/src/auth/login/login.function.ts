import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { ILoginReq } from './login.interface';

export const LoginFunction = onRequest(
  async (req: Request, res: Response) => {
    const loginData: ILoginReq = req.body;

    getAuth()
  }
);
