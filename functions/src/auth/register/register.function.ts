import * as logger from 'firebase-functions/logger';
import * as nodemailer from 'nodemailer';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'express';
import { DocumentReference, QuerySnapshot, getFirestore } from 'firebase-admin/firestore';

import { ResponseBody } from '../../shared/models';
import { GetRegisterTemplate, generateJwt } from '../../shared/utils';
import { COLLECTIONS, ENV_KEYS, ENV_SECRETS, ERROR_MESSAGES, FE_URLS, RESPONSE_STATUS, TRANSLATIONS } from '../../shared/constants';
import { RegisterValidator } from './register.validator';
import { IRegisterReq } from './register.interface';
import { RegisterMapper } from './register.mapper';

export const RegisterFunction = onRequest(
  {
    secrets: [ENV_SECRETS.MAIL_PASS, ENV_SECRETS.MAIL_USER, ENV_SECRETS.JWT_SECRET],
    cors: [process.env[ENV_KEYS.UI_URL]!, process.env[ENV_KEYS.UI_URL_LOCAL]!]
  },
  async (req: Request, res: Response): Promise<void> => {
    const resetTokenExp = process.env[ENV_KEYS.RESET_TOKEN_EXP];
    const uiUrl = process.env[ENV_KEYS.UI_URL];
    const environment = process.env[ENV_KEYS.ENVIRONMENT];

    const userData: IRegisterReq = req.body;
    const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);

    let validationErrors: string[] | null = null;
    let existingUser: QuerySnapshot;

    try {
      existingUser = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', userData.email).get();
    } catch(e: any) {
      logger.error('[REGISTER] Querying DB by email failed', e);
      res.status(500).json(generalError);
      return;
    }

    if (!existingUser.empty) {
      res.status(400).json(new ResponseBody(null, false, [ERROR_MESSAGES.DUPLICATE], RESPONSE_STATUS.DUPLICATE));
      return;
    }

    validationErrors = RegisterValidator(userData);
    if (validationErrors) {
      res.status(400).json(new ResponseBody(null, false, validationErrors));
      return;
    }

    const currentTranslations = TRANSLATIONS[userData.lang];

    let prospectiveUser;

    try {
      prospectiveUser = await RegisterMapper(userData);
    } catch (e: any) {
      logger.error('[REGISTER] Hashing of password failed', e);
      res.status(500).json(generalError);
      return;
    }

    let userDocumentReference: DocumentReference;
    try {
      userDocumentReference = await getFirestore()
        .collection(COLLECTIONS.USERS)
        .add(prospectiveUser);
    } catch (e: any) {
      logger.error('[REGISTER] Storing of user data failed', e);
      res.status(500).json(generalError);
      return;
    }

    logger.info(`[REGISTER] Created user: ${userDocumentReference.id}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env[ENV_SECRETS.MAIL_USER],
        pass: process.env[ENV_SECRETS.MAIL_PASS]
      }
    });

    let confirmToken;
    try {
      confirmToken = generateJwt(
        { email: userData.email },
        process.env[ENV_SECRETS.JWT_SECRET] as string,
        { expiresIn: resetTokenExp }
      );
    } catch (error: unknown) {
      logger.error('[REGISTER] Signing JWT for register confirmation email failed');
      res.status(500).json(generalError);
    }

    const mailOptions = GetRegisterTemplate({
      lang: userData.lang,
      to: userData.email,
      subject: currentTranslations.registerEmailSubject,
      title: currentTranslations.registerEmailTitle,
      message: currentTranslations.registerEmailMessage,
      config: {
        url: `${uiUrl}/${FE_URLS.CONFIRM_REGISTER}/${confirmToken}`
      }
    });

    transporter.sendMail(mailOptions, (e: any) => {
      if (e) {
        if (environment === 'PROD') {
          logger.error('[REGISTER] Nodemailer failed to send register confirmation email', e);
        }
        res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
        return;
      }
      logger.info(`[REGISTER] Register confirmation email was sent to: ${userData.email}`);
      res.status(201).send(new ResponseBody({}, true));
    });
  }
);
