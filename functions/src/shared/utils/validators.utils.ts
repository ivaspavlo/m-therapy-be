export function validate(req: any, fieldValidators: any): string[] {
  return Object.entries(req).reduce((acc: string[], [key, value]) => {
    const currValidators = fieldValidators[key];
    if (!currValidators) {
      return [ ...acc, key ];
    }
    if (!currValidators.length) {
      return acc;
    }
    const hasError = currValidators.some((validator: any) => !validator(value));
    return hasError
      ? [ ...acc, key ]
      : acc;
  }, []);
}

// At least: 8 characters, one letter, one number, one special character.
export function passwordValidator(value: string): boolean {
  return typeof value === 'string' && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value);
}

export function birthdayValidator(value: number): boolean {
  if (typeof value !== 'number') {
    return false;
  }
  return new Date().getFullYear() - new Date(value).getFullYear() <= 90;
}

export function minCharQty(limit: number): (v: string) => boolean {
  return (value): boolean => {
    return typeof value === 'string' && value.length >= limit;
  };
}

export function maxCharQty(limit: number): (v: string) => boolean {
  return (value): boolean => {
    return typeof value === 'string' && value.length <= limit;
  }
}

export function emailValidator(value: string): boolean {
  return typeof value === 'string' && /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value);
}

export function langFieldValidator(value: string): boolean {
  return value === 'en' || value === 'ua';
}
