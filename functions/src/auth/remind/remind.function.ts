import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { defineString } from 'firebase-functions/params';
import * as logger from 'firebase-functions/logger';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { ResponseBody } from '../../shared/models';
import { ENV_KEYS, ERROR_MESSAGES } from '../../shared/constants';
import { GetNodemailerTemplate } from '../../shared/utils';
import { IRemindReq } from './remind.interface';
import { RemindValidator } from './remind.validator';


const resetTokenExp = defineString(ENV_KEYS.RESET_TOKEN_EXP).value();
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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env[ENV_KEYS.MAIL_USER],
        pass: process.env[ENV_KEYS.MAIL_PASS]
      }
    });

    let resetToken = null;
    try {
      resetToken = jwt.sign({ email: remindReq.email }, process.env[ENV_KEYS.JWT_SECRET] as string, { expiresIn: resetTokenExp });
    } catch (e: any) {
      logger.error('Signing JWT for reminder email failed', e);
      res.status(500).json(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
      return;
    }

    const mailOptions = GetNodemailerTemplate({
      lang: remindReq.lang,
      to: remindReq.email,
      subject: remindReq.lang === 'en' ? 'Reset of password for Tkachuk Massage Therapy' : 'Змінити пароль для Tkachuk Massage Therapy',
      title: remindReq.lang === 'en' ? 'Password reset' : 'Зміна пароля',
      message: remindReq.lang === 'en' ? 'Please follow the link below in order to reset your password:' : 'Будь ласка, перейдіть за посиланням нижче для того, щоб змінити пароль:',
      url: `${uiUrl}/reset/${resetToken}`
    });

    transporter.sendMail(mailOptions, (e: any) => {
      if (e) {
        logger.error('Nodemailer failed to send reminder email', e);
        res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
        return;
      }

      logger.info(`Remind email was sent to: ${remindReq.email}`);
      res.status(200).send(new ResponseBody({}, true));
    });
  }
);
