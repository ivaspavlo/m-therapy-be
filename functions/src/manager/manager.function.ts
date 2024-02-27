import * as logger from 'firebase-functions/logger';
import * as nodemailer from 'nodemailer';
// import * as jwt from 'jsonwebtoken';
import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { Request, Response } from 'firebase-functions';
import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES, TRANSLATIONS } from '../shared/constants';
import { ResponseBody } from '../shared/models';
// import { IUser } from '../shared/interfaces';
// import { AdEmailReq } from 'src/auth/remind/remind.interface';
import { ManagerValidator } from './manager.validator';
import { IAdEmailReq } from './manager.interface';
import { GetNodemailerTemplate } from '../shared/utils';


export const ManagerFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    // const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);
    const jwtError = new ResponseBody(null, false, [ERROR_MESSAGES.JWT]);

    const authData = req.headers.authorization;

    if (!authData || typeof authData !== 'string') {
      res.status(401).json(jwtError);
    }

    // Strip 'Bearer'
    // const clientJWT = authData!.split(' ')[1];

    // try {
    //   jwt.verify(clientJWT as string, process.env[ENV_KEYS.JWT_SECRET] as string);
    // } catch (e: any) {
    //   res.status(401).json(jwtError);
    //   return;
    // }

    // let parsedClientToken: { [key:string]: string, id: string };
    // try {
    //   parsedClientToken = JSON.parse(Buffer.from(clientJWT!.split('.')[1], 'base64').toString());
    // } catch (e: any) {
    //   res.status(401).json(jwtError);
    //   return;
    // }

    // let userDocumentData: DocumentData;
    // try {
    //   userDocumentData = (await getFirestore().collection(COLLECTIONS.USERS).doc(parsedClientToken.id).get());
    // } catch(e: any) {
    //   logger.error('[Manager] Querying DB by email failed', e);
    //   res.status(500).json(generalError);
    //   return;
    // }

    // if (!userDocumentData.exists) {
    //   res.status(400).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_FOUND]));
    //   return;
    // }

    // const user: IUser = userDocumentData.data() as IUser;

    // if (!user.isAdmin) {
    //   res.status(401).json(jwtError);
    //   return;
    // }

    switch(req.method) {
    case('POST'): return postManagerData(req, res);
    }
  }
);

async function postManagerData(req: Request, res: Response): Promise<any> {
  switch(req.url) {
  case('/emails'): {
    const reqBody: IAdEmailReq = req.body;

    const validationErrors: string[] | null = ManagerValidator(reqBody);
    if (validationErrors) {
      res.status(400).send(new ResponseBody(null, false, [ERROR_MESSAGES.FIELDS_VALIDATION]));
      return;
    }

    const currentTranslations = TRANSLATIONS[reqBody.lang];

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env[ENV_KEYS.MAIL_USER],
        pass: process.env[ENV_KEYS.MAIL_PASS]
      }
    });
    
    let emails: string[] | undefined;
    try {
      emails = (await getFirestore().collection(COLLECTIONS.USERS).get()).docs.map(d => d.data().email);
    } catch (e) {
      logger.error('[MANAGER POST EMAILS] Error while retrieving user emails');
      res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
    }

    if (!Array.isArray(emails) || !emails.length) {
      res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      logger.error('[MANAGER POST EMAILS] No user emails found');
    }

    logger.info('[MANAGER POST EMAILS] Retrieved emails list');

    const transporterArr = emails!.map(email => {
      const mailOptions = GetNodemailerTemplate({
        lang: reqBody.lang,
        to: email,
        subject: currentTranslations.remindEmailSubject,
        title: currentTranslations.remindEmailTitle,
        message: currentTranslations.remindEmailMessage,
        url: reqBody.url
      });
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (e: any) => {
          if (e) {
            logger.error(`[MANAGER POST EMAILS] Ad email failed to send to: ${email}. Error: ${e}`);
            resolve(email);
          }
          resolve(null);
          logger.info(`[MANAGER POST EMAILS] Ad email was sent to: ${email}`);
        });
      });
    });

    Promise.all(transporterArr).then((result: any) => {
      const failedToSend = result.filter((i: any) => i !== null);
      logger.info(`[MANAGER POST EMAILS] All ad emails were sent`);
      res.status(200).send(new ResponseBody({ failedToSend }, true));
    });
  }
  }
}
