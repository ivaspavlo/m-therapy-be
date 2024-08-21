import { ERROR_MESSAGES } from '../shared/constants';
import { IValidationConfig } from '../shared/interfaces';
import { numberValidator, validate, arrayValidator, stringValidator, booleanValidator, emailValidator, isFalseValidator, langFieldValidator } from '../shared/utils';

const fetchBookingValidators: Record<keyof {fromDate: unknown}, IValidationConfig> = {
  fromDate: {validators: [numberValidator]}
}

const putBookingValidatorSet: Record<keyof {}, IValidationConfig> = {
  bookingSlots: {validators: [arrayValidator, bookingSlotValidator]},
  email: {validators: [emailValidator]},
  language: {validators: [langFieldValidator]}
}

const bookingSlotValidatorSet: Record<keyof {}, IValidationConfig> = {
  id: {validators: [stringValidator]},
  start: {validators: [numberValidator]},
  end: {validators: [numberValidator]},
  isPreBooked: {validators: [booleanValidator]},
  isBooked: {isOptional: true, validators: [booleanValidator, isFalseValidator]},
  bookedByEmail: {isOptional: true, validators: [booleanValidator]}
}

function bookingSlotValidator(value: unknown[]): boolean {
  const incorrectSlot = value.find((item: unknown) => {
    const errors = validate(item, bookingSlotValidatorSet);
    return !!errors.length;
  });
  return incorrectSlot === undefined;
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
