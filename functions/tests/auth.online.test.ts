import { describe, expect, afterAll, beforeAll, test } from '@jest/globals';
import {
  DocumentData,
  // QueryDocumentSnapshot,
  getFirestore
} from 'firebase-admin/firestore';
import { defineString } from 'firebase-functions/params';
import firebaseFunctionsTest from 'firebase-functions-test';
import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import * as functions from 'src/index';
// import { IUser } from 'src/shared/interfaces';
import { ENV_KEYS } from 'src/shared/constants';


firebaseFunctionsTest({
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, process.env.FIREBASE_SERVICE_ACCOUNT || './mt-stage-db6be-a531eb8c5a6b.json');

dotenv.config({ path: './.env.local' });

const resetTokenExp = defineString(ENV_KEYS.RESET_TOKEN_EXP).value();
const jwtToken = defineString(ENV_KEYS.JWT_SECRET).value();

describe('Functions test online', () => {
  const MOCK_RES = {
    status: (code: number) => ({
      send: (value: any) => {},
      json: (value: any) => {}
    })
  };

  const REGISTER_REQ = {
    body: {
      firstname: 'Test',
      lastname: 'Testovich',
      email: 'testovichus@testmail.com',
      birthday: '1990-08-08',
      phone: '+111222333444',
      password: 'TestPass1!',
      lang: 'en'
    }
  };

  // describe('register', () => {

  //   afterAll(async () => {
  //     const usersQuery = getFirestore().collection('users').where('email', '==', REGISTER_REQ.body.email);
  //     const querySnapshot = await usersQuery.get();
  //     querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
  //   });

  //   test('should create a user in db', async () => {
  //     await functions.register(REGISTER_REQ as any, MOCK_RES as any);
  //     let user: IUser | null = null;
  //     try {
  //       const queryByEmail = await getFirestore().collection('users').where('email', '==', REGISTER_REQ.body.email).get();
  //       const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find((d: any) => !!d);
  //       user = userDocumentSnapshot?.data() as IUser;
  //     } catch (error: any) {
  //       // no action
  //     }

  //     expect(user?.email).toEqual(REGISTER_REQ.body.email);
  //   });

  //   test('should return 400 when user exists', async () => {
  //     const res = {
  //       status: (code: number) => {
  //         expect(code).toBe(400);
  //         return {
  //           send: (value: any) => {},
  //           json: (value: any) => {}
  //         };
  //       }
  //     };
  //     await functions.register(REGISTER_REQ as any, res as any);
  //   });

  // });

  describe('login', () => {
    const MOCK_REQ = {
      body: {
        email: 'testovichus@testmail.com',
        password: 'TestPass1!'
      }
    };

    beforeAll(async () => {
      await functions.register(REGISTER_REQ as any, MOCK_RES as any);
    });

    afterAll(async () => {
      const usersQuery = getFirestore().collection('users').where('email', '==', MOCK_REQ.body.email);
      const querySnapshot = await usersQuery.get();
      querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
    });

    test('should return status 200 when creds are correct', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(200);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          };
        }
      };
      await functions.login(MOCK_REQ as any, res as any);
    });

    test('should return status 401 when creds are incorrect', async () => {
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
    const VALID_JWT = jwt.sign({ email: REGISTER_REQ.body.email }, jwtToken, { expiresIn: resetTokenExp });
    const JWT_INCORRECT_SIGNITURE = jwt.sign({ email: REGISTER_REQ.body.email }, 'incorrect_secret', { expiresIn: resetTokenExp });
    const JWT_INCORRECT_EMAIL = jwt.sign({ email: 'incorrect_email@gmail.com' }, jwtToken, { expiresIn: resetTokenExp });
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
      await functions.register(REGISTER_REQ as any, MOCK_RES as any);
    });

    afterAll(async () => {
      const usersQuery = getFirestore().collection('users').where('email', '==', REGISTER_REQ.body.email);
      const querySnapshot = await usersQuery.get();
      querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
    });

    test('should return 401 if the token is not valid', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(401);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.reset({ ...MOCK_REQ, query: { token: JWT_INCORRECT_SIGNITURE } } as any, res as any);
    });

    test('should return 200 if the token is valid', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(200);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.reset({ ...MOCK_REQ, query: { token: VALID_JWT } } as any, res as any);
    });

    test('should return 400 if the email is incorrect', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(400);
          return {
            send: (value: any) => { },
            json: (value: any) => { }
          }
        }
      };
      await functions.reset({ ...MOCK_REQ, query: { token: JWT_INCORRECT_EMAIL } } as any, res as any);
    });
  });
});
