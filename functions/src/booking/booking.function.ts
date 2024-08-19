import * as nodemailer from 'nodemailer';
import { defineString } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { logger, Request, Response } from 'firebase-functions';
import { DocumentSnapshot, getFirestore, QuerySnapshot } from 'firebase-admin/firestore';

import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES, TRANSLATIONS } from '../shared/constants';
import { ResponseBody } from '../shared/models';
import { generateJwt, GetConfirmBookingTemplate } from '../shared/utils';
import { IBookingReq, IBookingSlot } from './booking.interface';
import { fetchBookingValidator, putBookingValidator } from './booking.validator';

export const BookingFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    switch(req.method) {
    case('GET'): return getBooking(req, res);
    case('PUT'): return putBooking(req, res);
    case('POST'): return postBooking(req, res);
    case('DELETE'): return deleteBooking(req, res);
    }
  }
);

const uiUrl = defineString(ENV_KEYS.UI_URL);
const resetTokenExp = defineString(ENV_KEYS.RESET_TOKEN_EXP);
const environment = defineString(ENV_KEYS.ENVIRONMENT);

async function getBooking(
  req: Request,
  res: Response
): Promise<any> {
  if (req.url.includes('fromDate')) {
    let fromDate = null;
    try {
      // @ts-ignore
      fromDate = +req.query.fromDate as number;
    } catch (e: unknown) {
      return res.status(400).json(new ResponseBody(null, false, [ERROR_MESSAGES.BAD_DATA]));
    }

    const validationErrors = fetchBookingValidator({fromDate});
    if (validationErrors) {
      res.status(400).json(new ResponseBody(null, false, validationErrors));
      return;
    }

    // Commented out for development purposes
    // @ts-ignore
    // const endDate = new Date(fromDate);
    // endDate.setDate(endDate.getDate() + 14);
    // const querySnapshot: QuerySnapshot = await getFirestore().collection(COLLECTIONS.BOOKINGS).where('start', '>=', fromDate).where('start', '<=', endDate.valueOf()).get();

    const querySnapshot: QuerySnapshot = await getFirestore().collection(COLLECTIONS.BOOKINGS).where('start', '>=', fromDate).get();
    const docs: IBookingSlot[] = querySnapshot.docs.map((doc: DocumentSnapshot) => ({ id: doc.id, ...doc.data() } as IBookingSlot));

    logger.info(`[GET BOOKING] Retrieved ${docs.length} bookings starting with date: ${fromDate}`);
    return res.status(200).send(new ResponseBody(docs, true));
  }
  return res.status(404).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_EXIST]));
}

async function putBooking(
  req: Request,
  res: Response
): Promise<any> {
  const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);

  const reqBody: IBookingReq = req.body;
  const validationErrors = putBookingValidator(reqBody);
  if (validationErrors) {
    res.status(400).json(new ResponseBody(null, false, validationErrors));
    return;
  }

  let preBookingId;
  try {
    preBookingId = (await getFirestore().collection(COLLECTIONS.PREBOOKINGS).add(reqBody)).id;
  } catch (error) {
    return res.status(500).json(generalError);
  }

  let user;
  try {
    user = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', reqBody.email).get();
  } catch (error) {
    return res.status(500).json(generalError);
  }

  // If user is not registered
  if (user.empty) {
    const datesForTemplate = reqBody.bookingSlots.map((slot: IBookingSlot) => {
      const dateStart = new Date(slot.start);
      return `<span>${dateStart.getDay() + 1}.${dateStart.getMonth() + 1} - ${dateStart.getHours()}:${dateStart.getMinutes()}<span>`;
    });

    let token;
    try {
      token = generateJwt(
        { preBookingId: preBookingId },
        process.env[ENV_KEYS.JWT_SECRET] as string,
        { expiresIn: resetTokenExp.value() }
      );
    } catch (error: unknown) {
      logger.error('[PUT BOOKING] Signing JWT for pre-booking confirmation email failed');
      res.status(500).json(generalError);
    }

    // @ts-ignore
    const currentTranslations = TRANSLATIONS[reqBody.lang];

    const mailOptions = GetConfirmBookingTemplate({
      title: currentTranslations.confirmBookingTitle,
      subject: currentTranslations.confirmBookingSubject,
      to: reqBody.email,
      message: `${currentTranslations.confirmBookingMessage}: ${datesForTemplate}`,
      config: {
        subtitle: currentTranslations.subtitle,
        url: `${uiUrl}/pre-booking/${token}`
      }
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env[ENV_KEYS.MAIL_USER],
        pass: process.env[ENV_KEYS.MAIL_PASS]
      }
    });

    transporter.sendMail(mailOptions, (error: unknown) => {
      if (error) {
        if (environment.value() === 'PROD') {
          logger.error('[PUT BOOKING] Nodemailer failed to send pre-booking confirmation email', error);
        }
        res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
        return;
      }

      logger.info(`[PUT BOOKING] Pre-booking confirmation email was sent to: ${reqBody.email}`);
      res.status(201).send(new ResponseBody({}, true));
    });
  }

  reqBody.bookingSlots.map(async (slot) => {
    await getFirestore().doc(slot.id).update({isBooked: true}).finally();
  });

  return res.status(201).json(new ResponseBody({}, true));
}

async function postBooking(
  req: Request,
  res: Response
): Promise<any> {
  return res.status(404).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_EXIST]));
}

async function deleteBooking(
  req: Request,
  res: Response
): Promise<any> {
  return res.status(404).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_EXIST]));
}