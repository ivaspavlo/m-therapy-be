import { ERROR_MESSAGES } from '../shared/constants';
import { IValidationConfig } from '../shared/interfaces';
import { numberValidator, validate, arrayValidator, stringValidator, booleanValidator, emailValidator, isFalseValidator, langFieldValidator, stringArrayValidator, IFormDataBody, IFormDataFile } from '../shared/utils';

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
  paymentFile: {validators: [bookingFileValidator]},
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

function bookingFileValidator(value: unknown): boolean {
  if (value && typeof value !== 'object') {
    return false;
  }

  const fileObj = value as IFormDataFile;

  if (!fileObj?.size || !fileObj?.filename || !fileObj?.encoding || !fileObj?.mimeType || !fileObj?.buffer) {
    return false;
  }

  if (!Buffer.isBuffer(fileObj.buffer)) {
    return false;
  }

  const allowedFormats = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedFormats.includes(fileObj.mimeType)) {
    return false;
  }

  // Prevent path traversal attacks (../, absolute paths). Allow only certain characters in filenames.
  if (!/^[\w,\s-]+\.[A-Za-z]{3,4}$/.test(fileObj.filename)) {
    return false;
  }

  // 10MB in bytes.
  const maxSize = 10 * 1024 * 1024;
  if (fileObj.size <= 0 && fileObj.size > maxSize) {
    return false;
  }

  // Extra image validation.


  return true;
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
