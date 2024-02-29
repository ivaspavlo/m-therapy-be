import * as jwt from 'jsonwebtoken';

export function jwtParser(authData: string): string | null {
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

export function jwtValidator(jwtToken: string, secret: string): boolean {
  try {
    jwt.verify(jwtToken, secret);
    return true;
  } catch (e: any) {
    return false;
  }
}
