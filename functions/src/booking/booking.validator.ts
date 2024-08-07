import { ERROR_MESSAGES } from '../shared/constants';
import { IValidationConfig } from '../shared/interfaces';
import { numberValidator, validate, arrayValidator } from '../shared/utils';

const fetchBookingValidators: Record<keyof {fromDate: unknown}, IValidationConfig> = {
  fromDate: {validators: [numberValidator]}
}

const putBookingValidatorSet: Record<keyof {}, IValidationConfig> = {
  bookingSlots: {validators: [arrayValidator, bookingSlotValidator]}
}

function bookingSlotValidator(value: unknown): boolean {
  return value !== null
    // @ts-ignore
    && typeof value === 'object' && typeof value.id === 'string' && typeof value.start === 'number' && typeof value.end === 'number' && typeof value.isBooked === 'boolean' && typeof value.bookedBy === 'string'
}

export const fetchBookingValidator = (
  data: unknown
): string[] | null => {
  const errors = validate(data, fetchBookingValidators);
  return errors.length
    ? [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`]
    : null;
}

export const putBookingValidator = (
  data: unknown
): string[] | null => {
  const errors = validate(data, putBookingValidatorSet);
  return errors.length
    ? [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`]
    : null;
}
