import { QuerySnapshot } from 'firebase-admin/firestore';
import { IRegisterReq } from './register.interface';
import { ERROR_MESSAGES } from '../../shared/constants';


const fieldValidators: Record<keyof IRegisterReq, Function[]> = {
  firstname: [minCharQty(3), maxCharQty(20)],
  lastname: [minCharQty(3), maxCharQty(20)],
  email: [emailValidator],
  phone: [minCharQty(9), maxCharQty(15)],
  password: [passwordValidator]
}

export const RegisterValidator = (req: IRegisterReq, queryByEmail: QuerySnapshot): string[] | null => {
  if (!queryByEmail.empty) {
    return [ERROR_MESSAGES.DUPLICATE];
  }

  const errors = Object.entries(req).reduce((acc: string[], [key, value]) => {
    const currValidators = fieldValidators[key as keyof IRegisterReq];
    if (!currValidators) {
      return [ ...acc, key ];
    }
    if (!currValidators.length) {
      return acc;
    }
    const hasError = currValidators.some(validator => !validator(value));
    return hasError
      ? [ ...acc, key ]
      : acc;
  }, []);

  if (errors.length) {
    return [`${ERROR_MESSAGES.FIELDS_VALIDATION}: ${errors.join(',')}`];
  }

  return null;
}

function minCharQty(limit: number): (v: string) => boolean {
  return (value): boolean => {
    return typeof value === 'string' && value.length >= limit;
  };
}

function maxCharQty(limit: number): (v: string) => boolean {
  return (value): boolean => {
    return typeof value === 'string' && value.length <= limit;
  }
}

function emailValidator(value: string): boolean {
  return typeof value === 'string' && /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value);
}

// At least: 8 characters, one letter, one number, one special character.
function passwordValidator(value: string): boolean {
  return typeof value === 'string' && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
}
