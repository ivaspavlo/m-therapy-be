import { ERROR_MESSAGES } from '../shared/constants';
import { IValidationConfig } from '../shared/interfaces';
import { numberValidator, validate, arrayValidator, stringValidator, booleanValidator } from '../shared/utils';

const fetchBookingValidators: Record<keyof {fromDate: unknown}, IValidationConfig> = {
  fromDate: {validators: [numberValidator]}
}

const putBookingValidatorSet: Record<keyof {}, IValidationConfig> = {
  bookingSlots: {validators: [arrayValidator, bookingSlotValidator]}
}

const bookingSlotValidatorSet: Record<keyof {}, IValidationConfig> = {
  id: {validators: [stringValidator]},
  start: {validators: [numberValidator]},
  end: {validators: [numberValidator]},
  isBooked: {isOptional: true, validators: [booleanValidator]},
  bookedBy: {isOptional: true, validators: [booleanValidator]}
}

function bookingSlotValidator(value: unknown[]): boolean {
  const errors = value.find((item: unknown) => validate(item, bookingSlotValidatorSet));
  return errors === undefined;
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
