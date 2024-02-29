import * as logger from 'firebase-functions/logger';
import * as nodemailer from 'nodemailer';
import { onRequest } from 'firebase-functions/v2/https';
import { DocumentData, getFirestore } from 'firebase-admin/firestore';
import { Request, Response } from 'firebase-functions';
import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES, TRANSLATIONS } from '../shared/constants';
import { ResponseBody } from '../shared/models';
import { GetNodemailerTemplate, jwtParser, jwtValidator } from '../shared/utils';
import { IUser } from '../shared/interfaces';
import { ManagerValidator } from './manager.validator';
import { IAdEmailReq } from './manager.interface';


export const ManagerFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);
    const jwtError = new ResponseBody(null, false, [ERROR_MESSAGES.JWT]);

    const jwtToken: string | null = jwtParser(req.headers.authorization as string);
    if (!jwtToken || jwtValidator(jwtToken, process.env[ENV_KEYS.JWT_SECRET] as string)) {
      res.status(401).json(jwtError);
    }

    // continue
    let userDocumentData: DocumentData;
    try {
      userDocumentData = (await getFirestore().collection(COLLECTIONS.USERS).doc('jwtToken.id').get());
    } catch(e: any) {
      logger.error('[Manager] Querying DB by email failed', e);
      res.status(500).json(generalError);
      return;
    }

    if (!userDocumentData.exists) {
      res.status(400).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_FOUND]));
      return;
    }

    const user: IUser = userDocumentData.data() as IUser;

    if (!user.isAdmin) {
      res.status(401).json(jwtError);
      return;
    }

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
        subject: reqBody.subject || currentTranslations.adEmailSubject,
        title: reqBody.title,
        message: reqBody.message,
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
