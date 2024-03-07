import * as jwt from 'jsonwebtoken';

export function parseJwt(authData: string): { [key:string]: string } | null {
  if (!authData || typeof authData !== 'string') {
    return null;
  }
  const rawJwt = authData.split(' ')[1];
  try {
    return JSON.parse(Buffer.from(rawJwt!.split('.')[1], 'base64').toString());
  } catch (e: any) {
    return null;
  }
}

export function validateJwt(authData: string, secret: string): boolean {
  try {
    jwt.verify(authData, secret);
    return true;
  } catch (e: any) {
    return false;
  }
}

export function stripBearer(authData: string): string {
  return authData.includes('Bearer ')
    ? authData.split(' ')[1]
    : '';
}

export function extractJwt<T>(authData: string, secret: string): T | null {
  const rawJwt = stripBearer(authData);
  return validateJwt(rawJwt, secret)
    ? parseJwt(rawJwt) as T
    : null;
}
