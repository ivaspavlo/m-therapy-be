import * as jwt from 'jsonwebtoken';

export function parseJwt(authData: string): { [key:string]: string } | null {
  const rawJwt = stripBearer(authData);
  if (!rawJwt || typeof rawJwt !== 'string') {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(rawJwt!.split('.')[1], 'base64').toString());
  } catch (e: any) {
    return null;
  }
}

export function validateJwt(authData: string, secret: string): boolean {
  if (typeof authData !== 'string') {
    return false;
  }
  const rawJwt = stripBearer(authData);
  try {
    jwt.verify(rawJwt, secret);
    return true;
  } catch (e: any) {
    return false;
  }
}

export function stripBearer(authData: string): string {
  return authData?.includes('Bearer ')
    ? authData.split(' ')[1]
    : authData;
}

export function extractJwt<T>(authData: string, secret: string): T | null {
  return validateJwt(authData, secret)
    ? parseJwt(authData) as T
    : null;
}

export function generateJwt(data: object, secret: string, options: object = {}): string | null {
  try {
    return jwt.sign(data, secret, options);
  } catch (e: any) {
    return null;
  }
}
