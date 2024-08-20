import * as nodemailer from 'nodemailer';
import { defineString } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { logger, Request, Response } from 'firebase-functions';
import { DocumentData, DocumentSnapshot, getFirestore, QuerySnapshot } from 'firebase-admin/firestore';

import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES, TRANSLATIONS } from '../shared/constants';
import { ResponseBody } from '../shared/models';
import { extractJwt, generateJwt, GetConfirmBookingTemplate } from '../shared/utils';
import { IBookingReq, IBookingSlot } from './booking.interface';
import { fetchBookingValidator, putBookingValidator } from './booking.validator';
import { IUser } from 'src/shared/interfaces';

const BookingURLs = {
  GET: {
    fromDate: 'fromDate'
  },
  PUT: {
    preBooking: 'pre-booking',
    preBookingConfirm: 'pre-booking/confirm',
    bookingApprove: 'approve'
  }
}

export const BookingFunction = onRequest(
  { secrets: [ENV_KEYS.JWT_SECRET] },
  async (req: Request, res: Response): Promise<void> => {
    switch(req.method) {
    case('GET'): return getBookingHandler(req, res);
    case('PUT'): return putBookingHandler(req, res);
    case('POST'): return postBookingHandler(req, res);
    case('DELETE'): return deleteBookingHandler(req, res);
    }
  }
);

const uiUrl = defineString(ENV_KEYS.UI_URL);
const resetTokenExp = defineString(ENV_KEYS.RESET_TOKEN_EXP);
const environment = defineString(ENV_KEYS.ENVIRONMENT);

async function getBookingHandler(
  req: Request,
  res: Response
): Promise<any> {
  if (req.url.includes(BookingURLs.GET.fromDate)) {
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

async function putBookingHandler(
  req: Request,
  res: Response
): Promise<any> {
  const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);
  const jwtError = new ResponseBody(null, false, [ERROR_MESSAGES.JWT]);

  if (req.url.includes(BookingURLs.PUT.preBooking)) {
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

    // If user is not registered or not confirmed
    if (user?.empty || user.docs[0]?.data()?.isConfirmed) {
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
        logger.error('[PUT BOOKING PRE_BOOKING] Signing JWT for pre-booking confirmation email failed');
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
            logger.error('[PUT BOOKING PRE_BOOKING] Nodemailer failed to send pre-booking confirmation email', error);
          }
          res.status(500).send(new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]));
          return;
        }

        logger.info(`[PUT BOOKING PRE_BOOKING] Pre-booking confirmation email was sent to: ${reqBody.email}`);
        res.status(201).send(new ResponseBody({}, true));
      });
    }

    reqBody.bookingSlots.forEach(async (slot: IBookingSlot) => {
      await getFirestore().collection(COLLECTIONS.BOOKINGS).doc(slot.id).update({isPreBooked: true});
    });

    return res.status(201).json(new ResponseBody({}, true));
  } else if (req.url.includes(BookingURLs.PUT.preBookingConfirm)) {
    const jwtToken = extractJwt<{preBookingId: string} | null>(
      req.query.token as string,
      process.env[ENV_KEYS.JWT_SECRET] as string
    );

    if (!jwtToken) {
      res.status(401).json(jwtError);
      return;
    }

    let preBooking;
    try {
      preBooking = await getFirestore().collection(COLLECTIONS.PREBOOKINGS).doc(jwtToken.preBookingId).get();
    } catch (error: unknown) {
      return res.status(500).json(generalError);
    }

    preBooking.data()!.bookingSlots.forEach(async (slot: IBookingSlot) => {
      await getFirestore().collection(COLLECTIONS.BOOKINGS).doc(slot.id).update({isPreBooked: true});
    });

    res.status(201).send(new ResponseBody({}, true));
  } else if (req.url.includes(BookingURLs.PUT.bookingApprove)) {
    const jwtToken = extractJwt<{id: string} | null>(
      req.query.token as string,
      process.env[ENV_KEYS.JWT_SECRET] as string
    );

    if (!jwtToken) {
      res.status(401).json(jwtError);
      return;
    }

    let userDocumentData: DocumentData;
    try {
      userDocumentData = (await getFirestore().collection(COLLECTIONS.USERS).doc(jwtToken!.id).get());
    } catch(e: any) {
      logger.error('[PUT BOOKING APPROVE] Querying DB by user ID failed', e);
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

    const reqBody: IBookingReq = req.body;
    console.log(reqBody);
  }

  return res.status(404).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_EXIST]));
}

async function postBookingHandler(
  req: Request,
  res: Response
): Promise<any> {
  return res.status(404).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_EXIST]));
}

async function deleteBookingHandler(
  req: Request,
  res: Response
): Promise<any> {
  return res.status(404).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_EXIST]));
}