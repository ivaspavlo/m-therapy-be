import { ERROR_MESSAGES } from '../shared/constants';
import { IValidationConfig } from '../shared/interfaces';
import { numberValidator, validate } from '../shared/utils';
import { IGetBookingReq } from './booking.interface';

const fetchBookingValidators: Record<keyof IGetBookingReq, IValidationConfig> = {
  fromDate: {validators: [numberValidator]}
}

export const fetchBookingValidator = (
  data: IGetBookingReq
): string[] | null => {
  const errors = validate(data, fetchBookingValidators);
  return errors.length
    ? [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`]
    : null;
}
