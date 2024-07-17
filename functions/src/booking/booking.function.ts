import { onRequest } from 'firebase-functions/v2/https';
import { Request, Response } from 'firebase-functions';
import { ENV_KEYS } from 'src/shared/constants';

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