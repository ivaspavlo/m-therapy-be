import * as jwt from 'jsonwebtoken';
import * as functions from 'src/index';
import firebaseFunctionsTest from 'firebase-functions-test';
import dotenv from 'dotenv';
import { describe, expect, afterAll, beforeAll, test } from '@jest/globals';
import { DocumentData, QueryDocumentSnapshot, getFirestore } from 'firebase-admin/firestore';
import { defineString } from 'firebase-functions/params';
import { IUser } from 'src/shared/interfaces';
import { ENV_KEYS, COLLECTIONS } from 'src/shared/constants';


firebaseFunctionsTest({
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, process.env.FIREBASE_SERVICE_ACCOUNT || './mt-stage-db6be-a531eb8c5a6b.json');

dotenv.config({ path: './.env.local' });

const resetTokenExp = defineString(ENV_KEYS.RESET_TOKEN_EXP).value();
const jwtSecret = defineString(ENV_KEYS.JWT_SECRET).value();

describe('Auth functions', () => {
  const MOCK_RES = {
    status: (code: number) => ({
      send: (value: any) => {},
      json: (value: any) => {}
    })
  };

  const PASSWORD = 'TestPass1!';

  const REGISTERED_USER = {
    firstname: 'Test',
    lastname: 'Testovich',
    email: 'test@testmail.com',
    birthday: '1990-08-08',
    phone: '+111222333444',
    password: '$2b$04$.BloZCekJL3F3NXyileOL.wsTEYZeBkqhWExSnCB3CVbnXOeUQ0nm',
    lang: 'en',
    hasEmailConsent: true,
    isConfirmed: true
  };

  const VALID_CONFIRM_TOKEN = jwt.sign({ email: REGISTERED_USER.email }, jwtSecret, { expiresIn: resetTokenExp });
  const INVALID_CONFIRM_TOKEN_1 = jwt.sign({ email: REGISTERED_USER.email }, 'incorrect_secret', { expiresIn: resetTokenExp });
  const INVALID_CONFIRM_TOKEN_2 = jwt.sign({ email: 'incorrect_email@gmail.com' }, jwtSecret, { expiresIn: resetTokenExp });

  describe('register', () => {
    beforeAll(async () => {
      await functions.register({body: REGISTERED_USER} as any, MOCK_RES as any);
    });

    afterAll(async () => {
      const usersQuery = getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTERED_USER.email);
      const querySnapshot = await usersQuery.get();
      querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
    });

    test('[REGISTER] should create a user in db', async () => {
      let user: IUser | null = null;
      try {
        const queryByEmail = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTERED_USER.email).get();
        const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find((d: any) => !!d);
        user = userDocumentSnapshot?.data() as IUser;
      } catch (error: any) {
        // no action
      }
      expect(user?.email).toEqual(REGISTERED_USER.email);
    });

    test('[REGISTER] should return 400 when user exists', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(400);
          return {
            send: (value: any) => {},
            json: (value: any) => {}
          };
        }
      };
      await functions.register({body: REGISTERED_USER} as any, res as any);
    });
  });

  describe('login', () => {
    const LOGIN_MOCK_REQ = {
      body: {
        email: REGISTERED_USER.email,
        password: PASSWORD
      }
    };

    beforeAll(async () => {
      await getFirestore().collection(COLLECTIONS.USERS).add(REGISTERED_USER);
    });

    afterAll(async () => {
      const usersQuery = getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTERED_USER.email);
      const querySnapshot = await usersQuery.get();
      querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
    });

    test('[LOGIN] should return status 200 when creds are correct', async () => {
      const resetToken = jwt.sign(
        { email: REGISTERED_USER.email },
        process.env[ENV_KEYS.JWT_SECRET] as string,
        { expiresIn: resetTokenExp }
      );

      // @ts-ignore
      await functions.registerConfirm({ query: { token: resetToken } }, MOCK_RES as any);

      const res = {
        status: (code: number) => {
          expect(code).toBe(200);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          };
        }
      };
      await functions.login(LOGIN_MOCK_REQ as any, res as any);
    }, 10000);

    test('[LOGIN] should return status 401 when creds are incorrect', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(401);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      }
      await functions.login(
        { body: { email: 'incorrect_email@testmail.com', password: 'incorrect_pwd' } } as any,
        res as any
      );
    });
  });

  describe('reset', () => {
    const MOCK_REQ = {
      query: {
        token: null
      },
      body: {
        password: 'TestPass2!',
        oldPassword: 'TestPass1!'
      }
    };

    beforeAll(async () => {
      await getFirestore().collection(COLLECTIONS.USERS).add(REGISTERED_USER);
    });
  
    afterAll(async () => {
      const usersQuery = getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTERED_USER.email);
      const querySnapshot = await usersQuery.get();
      querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
    });

    test('[RESET] should return 401 if the token is not valid', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(401);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.reset({ ...MOCK_REQ, query: { token: INVALID_CONFIRM_TOKEN_1 } } as any, res as any);
    });

    test('[RESET] should return 400 if the email is incorrect', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(400);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.reset({ ...MOCK_REQ, query: { token: INVALID_CONFIRM_TOKEN_2 } } as any, res as any);
    });

    test('[RESET] should return 200 if the token is valid', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(200);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.reset({ ...MOCK_REQ, query: { token: VALID_CONFIRM_TOKEN } } as any, res as any);
    });
  });

  describe('registerConfirm', () => {
    beforeAll(async () => {
      await getFirestore().collection(COLLECTIONS.USERS).add(REGISTERED_USER);
    });
  
    afterAll(async () => {
      const usersQuery = getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTERED_USER.email);
      const querySnapshot = await usersQuery.get();
      querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
    });

    test('[REGISTER_CONFIRM] should return 401 if the token is not valid', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(401);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.registerConfirm({ query: { token: INVALID_CONFIRM_TOKEN_1 } } as any, res as any);
    });

    test('[REGISTER_CONFIRM] should return 400 if the email is incorrect', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(400);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.registerConfirm({ query: { token: INVALID_CONFIRM_TOKEN_2 } } as any, res as any);
    });

    test('[REGISTER_CONFIRM] should return 200 if the token is valid', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(200);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.registerConfirm({ query: { token: VALID_CONFIRM_TOKEN } } as any, res as any);
    });
  });
});
