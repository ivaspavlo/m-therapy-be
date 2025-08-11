import { ERROR_MESSAGES } from '../shared/constants';
import { IValidationConfig } from '../shared/interfaces';
import { numberValidator, validate, arrayValidator, stringValidator, booleanValidator, emailValidator, isFalseValidator, langFieldValidator, stringArrayValidator, IFormDataBody } from '../shared/utils';

const getBookingValidatorsSet: Record<keyof {productId: unknown, fromDate: unknown}, IValidationConfig> = {
  productId: {validators: [stringValidator]},
  fromDate: {validators: [numberValidator]}
}

const putBookingValidatorSet: Record<keyof {}, IValidationConfig> = {
  bookingSlots: {validators: [arrayValidator, bookingSlotValidator]},
  email: {validators: [emailValidator]},
  language: {validators: [langFieldValidator]}
}

const postBookingValidatorSet: Record<keyof {}, IValidationConfig> = {
  slots: {validators: [stringArrayValidator]},
  email: {validators: [stringValidator]},
  phone: {validators: [stringValidator]},
  comment: {validators: [stringValidator]},
  paymentFile: {validators: [fileSizeValidator, fileTypeValidator]},
  lang: {isOptional: true, validators: [langFieldValidator]},
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

function fileTypeValidator(value: unknown): boolean {
  const allowedFormats = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  return !!allowedFormats;
}

function fileSizeValidator(value: unknown): boolean {
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  return !!maxSize;
}

export const getBookingValidator = (
  data: unknown
): string[] | null => {
  const errors = validate(data, getBookingValidatorsSet);
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

export const postBookingValidator = (
  data: IFormDataBody
): string[] | null => {
  const errors = validate(data, postBookingValidatorSet);
  return errors.length
    ? [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`]
    : null;
}

// export interface IFormDataFile {
//   buffer: Buffer;
//   size: number;
//   filename: string;
//   encoding: string;
//   mimeType: string;
// }
