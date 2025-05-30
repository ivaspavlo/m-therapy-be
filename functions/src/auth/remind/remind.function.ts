import * as logger from 'firebase-functions/logger';
import * as nodemailer from 'nodemailer';
import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { defineString } from 'firebase-functions/params';
import { ResponseBody } from '../../shared/models';
import { ENV_KEYS, ERROR_MESSAGES, FE_URLS, TRANSLATIONS } from '../../shared/constants';
import { GetRemindPasswordTemplate, generateJwt } from '../../shared/utils';
import { IRemindReq } from './remind.interface';
import { RemindValidator } from './remind.validator';

const resetTokenExp = defineString(ENV_KEYS.RESET_TOKEN_EXP);
const uiUrl = defineString(ENV_KEYS.UI_URL);

export const RemindFunction = onRequest(
  { secrets: [ENV_KEYS.MAIL_PASS, ENV_KEYS.MAIL_USER, ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    const remindReq: IRemindReq = req.body;

    const validationErrors: string[] | null = RemindValidator(req.body);
    if (validationErrors) {
      res.status(400).send(new ResponseBody(null, false, [ERROR_MESSAGES.FIELDS_VALIDATION]));
      return;
    }

    const currentTranslations = TRANSLATIONS[remindReq.lang];

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env[ENV_KEYS.MAIL_USER],
        pass: process.env[ENV_KEYS.MAIL_PASS]
      }
    });

    const resetToken = generateJwt({ email: remindReq.email }, process.env[ENV_KEYS.JWT_SECRET] as string, { expiresIn: resetTokenExp.value() });
    if (!resetToken) {
      logger.error('[REMIND] Signing JWT for reminder email failed');
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      return;
    }

    const mailOptions = GetRemindPasswordTemplate({
      lang: remindReq.lang,
      to: remindReq.email,
      subject: currentTranslations.remindEmailSubject,
      title: currentTranslations.remindEmailTitle,
      message: currentTranslations.remindEmailMessage,
      config: {
        url: `${uiUrl.value()}/${FE_URLS.RESET_PASSWORD}/${resetToken}`
      }
    });

    transporter.sendMail(mailOptions, (e: any) => {
      if (e) {
        logger.error('[REMIND] Nodemailer failed to send reminder email', e);
        res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
        return;
      }

      logger.info(`[REMIND] Remind email was sent to: ${remindReq.email}`);
      res.status(200).send(new ResponseBody({}, true));
    });
  }
);
