import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { defineString } from 'firebase-functions/params';

const welcomeMessage = defineString('WELCOME_MESSAGE');


export const RegisterFunction = onRequest(
  // { cors: CORS_URLS, enforceAppCheck: true },
  async (req: Request, res: Response) => {
    console.log(welcomeMessage);
    const original = req.query.text;
    const writeResult = await getFirestore()
      .collection('messages')
      .add({original: original});

    res.json({result: `Message with ID: ${writeResult.id} added.`});
  }
);
