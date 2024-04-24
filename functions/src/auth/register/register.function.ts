import * as logger from 'firebase-functions/logger';
import * as nodemailer from 'nodemailer';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { DocumentReference, QuerySnapshot, getFirestore } from 'firebase-admin/firestore';
import { defineString } from 'firebase-functions/params';
import { ResponseBody } from '../../shared/models';
import { GetNodemailerTemplate, generateJwt } from '../../shared/utils';
import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES, FE_URLS, TRANSLATIONS } from '../../shared/constants';
import { RegisterValidator } from './register.validator';
import { IRegisterReq } from './register.interface';
import { RegisterMapper } from './register.mapper';


const resetTokenExp = defineString(ENV_KEYS.RESET_TOKEN_EXP);
const uiUrl = defineString(ENV_KEYS.UI_URL);
const environment = defineString(ENV_KEYS.ENVIRONMENT);

export const RegisterFunction = onRequest(
  { secrets: [ENV_KEYS.MAIL_PASS, ENV_KEYS.MAIL_USER, ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
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

    validationErrors = RegisterValidator(userData, existingUser);
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
        user: process.env[ENV_KEYS.MAIL_USER],
        pass: process.env[ENV_KEYS.MAIL_PASS]
      }
    });

    const confirmToken = generateJwt(
      { email: userData.email },
      process.env[ENV_KEYS.JWT_SECRET] as string,
      { expiresIn: resetTokenExp.value() }
    );
    if (!confirmToken) {
      logger.error('[REGISTER] Signing JWT for register confirmation email failed');
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      return;
    }

    const mailOptions = GetNodemailerTemplate({
      lang: userData.lang,
      to: userData.email,
      subject: currentTranslations.registerEmailSubject,
      title: currentTranslations.registerEmailTitle,
      message: currentTranslations.registerEmailMessage,
      config: {
        url: `${uiUrl.value()}/${FE_URLS.CONFIRM_REGISTER}/${confirmToken}`
      }
    });

    transporter.sendMail(mailOptions, (e: any) => {
      if (e) {
        if (environment.value() === 'PROD') {
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
