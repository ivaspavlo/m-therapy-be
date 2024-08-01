import { onRequest } from 'firebase-functions/v2/https';
import { logger, Request, Response } from 'firebase-functions';
import { DocumentSnapshot, getFirestore, QuerySnapshot } from 'firebase-admin/firestore';

import { COLLECTIONS, ENV_KEYS, ERROR_MESSAGES } from '../shared/constants';
import { ResponseBody } from '../shared/models';
import { extractJwt } from '../shared/utils';
import { IBookingSlot } from './booking.interface';
import { fetchBookingValidator } from './booking.validator';

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
  // const generalError = new ResponseBody(null, false, [ERROR_MESSAGES.GENERAL]);
  const jwtError = new ResponseBody(null, false, [ERROR_MESSAGES.JWT]);

  const jwtToken = extractJwt<{[key:string]: string} | null>(
    req.headers.authorization as string,
    process.env[ENV_KEYS.JWT_SECRET] as string
  );

  if (!jwtToken) {
    res.status(401).json(jwtError);
    return;
  }

  // const reqBody: IBookingSlot[] = req.body;
  // const validationErrors = null;
  // if (validationErrors) {
  //   res.status(400).json(new ResponseBody(null, false, validationErrors));
  //   return;
  // }

  return res.status(404).json(new ResponseBody(null, false, [ERROR_MESSAGES.NOT_EXIST]));
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