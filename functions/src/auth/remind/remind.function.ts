import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { ResponseBody } from '../../shared/models';
import { ERROR_MESSAGES } from '../../shared/constants';
import { IRemind } from './remind.interface';

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'samoran4ez@gmail.com',
    pass: 'HuanAntonio04'
  }
});

export const RemindFunction = onRequest(
  async (req: Request, res: Response): Promise<void> => {

    const addressee: IRemind = req.body;

    const mailOptions = {
      from: 'Your Account Name <yourgmailaccount@gmail.com>',
      to: addressee.email,
      subject: 'I\'M A PICKLE!!!',
      html: `
        <p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
        <br />
        <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
      `
    };

    transporter.sendMail(mailOptions, (e: any, info: any) => {
      if (e) {
        res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
        return;
      }
      res.status(200).send(new ResponseBody({}, true));
    });
  }
);
