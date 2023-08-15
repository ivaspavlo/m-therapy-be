import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { defineString } from 'firebase-functions/params';

const message = defineString('WELCOME_MESSAGE');

export const RegisterFunction = onRequest(
  // { cors: CORS_URLS, enforceAppCheck: true },
  async (req: Request, res: Response) => {
    

    const original = req.body;
    const writeResult = await getFirestore()
      .collection('messages')
      .add({original: original});

    res.json({result: `Message with ID: ${writeResult.id} added.`});
  }
);
