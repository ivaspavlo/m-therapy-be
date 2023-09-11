import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { ResponseBody } from '../../shared/models';
import { ENV_KEYS, ERROR_MESSAGES } from '../../shared/constants';
import { IRemindReq } from './remind.interface';
import { RemindValidator } from './remind.validator';
import { GetNodemailerOptions } from './remind.utils';

const nodemailer = require('nodemailer');


export const RemindFunction = onRequest(
  { secrets: [ENV_KEYS.MAIL_PASS, ENV_KEYS.MAIL_USER] },
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

    // let resetToken = crypto.randomBytes(32).toString("hex");

    const mailOptions = GetNodemailerOptions(remindReq);

    transporter.sendMail(mailOptions, (e: any) => {
      if (e) {
        res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
        return;
      }
      res.status(200).send(new ResponseBody({}, true));
    });
  }
);
