import * as jwt from 'jsonwebtoken';
import firebaseFunctionsTest from 'firebase-functions-test';
import { describe, expect, afterAll, beforeAll, test } from '@jest/globals';
import { DocumentData, QueryDocumentSnapshot, getFirestore } from 'firebase-admin/firestore';

import * as functions from 'src/index';
import { IUser } from 'src/shared/interfaces';
import { ENV_KEYS, COLLECTIONS, ENV_SECRETS, KEYS } from 'src/shared/constants';
import { cleanTestData } from 'src/shared/utils';

firebaseFunctionsTest({
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, process.env[ENV_KEYS.FIREBASE_SERVICE_ACCOUNT_STAGE] || 'stage-service-account-key.json');

const dotenv = require('dotenv');
dotenv.config();

describe('Auth functions', () => {
  const jwtSecret = 'mockSecret';
  const resetTokenExp = process.env[ENV_KEYS.JWT_EXP] as any;

  process.env[ENV_SECRETS.JWT_SECRET] = jwtSecret;
  process.env[ENV_SECRETS.MAIL_USER] = 'mockMailUser';
  process.env[ENV_SECRETS.MAIL_PASS] = 'mockMailSecret';

  const MOCK_RES = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    setHeader: jest.fn(),
    getHeader: jest.fn(),
    end: jest.fn(),
    on: jest.fn()
  };

  const MOCK_REQ = {
    headers: {origin: 'http://localhost'}
  }

  const PASSWORD = 'TestPass1!';

  const REGISTERED_USER = {
    [KEYS.TEST_DATA_TAG]: true,
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
      await functions.register({...MOCK_REQ, body: REGISTERED_USER} as any, MOCK_RES as any);
    });

    afterAll(async () => {
      const usersQuery = getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTERED_USER.email);
      const querySnapshot = await usersQuery.get();
      querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());

      // await cleanTestData(getFirestore());
    });

    test('[REGISTER] should create a user in db', async () => {
      let user: IUser | null = null;
      try {
        const queryByEmail = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTERED_USER.email).get();
        const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find((d: any) => !!d);
        user = userDocumentSnapshot?.data() as IUser;
      } catch (error: any) {
        console.log(error);
        // no action
      }
      expect(user?.email).toEqual(REGISTERED_USER.email);
    });

    test('[REGISTER] should return 400 when user exists', async () => {
      const res = {
        ...MOCK_RES,
        status: (code: number) => {
          expect(code).toBe(400);
          return {
            send: (value: any) => {},
            json: (value: any) => {}
          };
        }
      };
      await functions.register({...MOCK_REQ, body: REGISTERED_USER} as any, res as any);
    });
  });

  describe('login', () => {
    const LOGIN_MOCK_REQ = {
      ...MOCK_REQ,
      body: {
        email: REGISTERED_USER.email,
        password: PASSWORD
      }
    };

    afterAll(async () => {
      await cleanTestData(getFirestore());
    });

    test('[LOGIN] should return status 200 when creds are correct', async () => {
      await getFirestore().collection(COLLECTIONS.USERS).add(REGISTERED_USER);

      const resetToken = jwt.sign(
        { email: REGISTERED_USER.email },
        process.env[ENV_SECRETS.JWT_SECRET] as string,
        { expiresIn: resetTokenExp }
      );

      // @ts-ignore
      await functions.registerConfirm({...MOCK_REQ, query: {token: resetToken} }, MOCK_RES as any);

      const res = {
        ...MOCK_RES,
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
        ...MOCK_RES,
        status: (code: number) => {
          expect(code).toBe(401);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      }
      await functions.login(
        { ...MOCK_REQ, body: {email: 'incorrect_email@testmail.com', password: 'incorrect_pwd'} } as any,
        res as any
      );
    });
  });

  describe('reset', () => {
    const MOCK_REQ = {
      headers: {origin: 'http://localhost'},
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
      await cleanTestData(getFirestore());
    });

    test('[RESET] should return 401 if the token is not valid', async () => {
      const res = {
        ...MOCK_RES,
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
        ...MOCK_RES,
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
        ...MOCK_RES,
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
      await cleanTestData(getFirestore());
    });

    test('[REGISTER_CONFIRM] should return 401 if the token is not valid', async () => {
      const res = {
        ...MOCK_RES,
        status: (code: number) => {
          expect(code).toBe(401);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.registerConfirm({...MOCK_REQ, query: { token: INVALID_CONFIRM_TOKEN_1 }} as any, res as any);
    });

    test('[REGISTER_CONFIRM] should return 400 if the email is incorrect', async () => {
      const res = {
        ...MOCK_RES,
        status: (code: number) => {
          expect(code).toBe(400);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.registerConfirm({...MOCK_REQ, query: { token: INVALID_CONFIRM_TOKEN_2 }} as any, res as any);
    });

    test('[REGISTER_CONFIRM] should return 200 if the token is valid', async () => {
      const res = {
        ...MOCK_RES,
        status: (code: number) => {
          expect(code).toBe(200);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.registerConfirm({...MOCK_REQ, query: { token: VALID_CONFIRM_TOKEN }} as any, res as any);
    });
  });
});
