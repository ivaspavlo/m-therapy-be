import { ERROR_MESSAGES } from '../shared/constants';
import { IValidationConfig } from '../shared/interfaces';
import {
  numberValidator,
  validate,
  arrayValidator,
  stringValidator,
  booleanValidator,
  emailValidator,
  isFalseValidator,
  langFieldValidator,
  IFormDataBody,
  IFormDataFile,
  stringArrayValidator
} from '../shared/utils';

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
  bookings: {validators: [stringArrayValidator]},
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

  if (!fileObj?.buffer || !fileObj?.size || !fileObj?.filename || !fileObj.mimeType || !fileObj?.detectedMime || !fileObj?.extension) {
    return false;
  }

  if (!Buffer.isBuffer(fileObj.buffer)) {
    return false;
  }

  const allowedFormats = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedFormats.includes(fileObj.detectedMime)) {
    return false;
  }

  // MIME spoofing detected
  if (fileObj.detectedMime !== fileObj.mimeType) {
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
  const maxWidth = 10000;
  const maxHeight = 10000;
  if (fileObj.detectedMime.startsWith('image/')) {
    if (
      fileObj.width && fileObj.width > maxWidth ||
      fileObj.height && fileObj.height > maxHeight
    ) {
      return false
    }
  }

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
