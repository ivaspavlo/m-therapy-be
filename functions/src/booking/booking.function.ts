import { onRequest } from 'firebase-functions/v2/https';
import { logger, Request, Response } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';

import { COLLECTIONS, ENV_KEYS } from '../shared/constants';
import { ResponseBody } from '../shared/models';
import { IGetBookingReq } from './booking.interface';
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
  const reqBody: IGetBookingReq = req.body;

  const validationErrors = fetchBookingValidator(reqBody);
  if (validationErrors) {
    res.status(400).json(new ResponseBody(null, false, validationErrors));
    return;
  }

  const endDate = new Date(reqBody.fromDate);
  endDate.setDate(endDate.getDate() + 14);

  const bookingSlots = await getFirestore().collection(COLLECTIONS.BOOKINGS).where('start', '>=', reqBody.fromDate).where('start', '<=', endDate.valueOf());
  logger.info(`[GET BOOKING] Retrieved ${'111'} bookings.`);
  res.status(200).send(new ResponseBody(bookingSlots, true));
}

async function putBooking(
  req: Request,
  res: Response
): Promise<any> {
  
}

async function postBooking(
  req: Request,
  res: Response
): Promise<any> {
  
}

async function deleteBooking(
  req: Request,
  res: Response
): Promise<any> {
  
}