import * as jwt from 'jsonwebtoken';
import * as functions from 'src/index';
import firebaseFunctionsTest from 'firebase-functions-test';
import dotenv from 'dotenv';
import { describe, expect, afterAll, beforeAll, test } from '@jest/globals';
import { DocumentData, getFirestore } from 'firebase-admin/firestore';
import { defineString } from 'firebase-functions/params';
import { IContent } from 'src/shared/interfaces';
import { ENV_KEYS, COLLECTIONS } from 'src/shared/constants';
import { ResponseBody } from 'src/shared/models';


firebaseFunctionsTest({
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, process.env.FIREBASE_SERVICE_ACCOUNT || './mt-stage-db6be-a531eb8c5a6b.json');

dotenv.config({ path: './.env.local' });

const resetTokenExp = defineString(ENV_KEYS.RESET_TOKEN_EXP).value();
const jwtSecret = defineString(ENV_KEYS.JWT_SECRET).value();

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
      email: 'test@testmail.com',
      birthday: '1990-08-08',
      phone: '+111222333444',
      password: 'TestPass1!',
      lang: 'en'
    }
  };

  const VALID_CONFIRM_TOKEN = jwt.sign({ email: REGISTER_REQ.body.email }, jwtSecret, { expiresIn: resetTokenExp });
  const INVALID_CONFIRM_TOKEN_1 = jwt.sign({ email: REGISTER_REQ.body.email }, 'incorrect_secret', { expiresIn: resetTokenExp });
  const INVALID_CONFIRM_TOKEN_2 = jwt.sign({ email: 'incorrect_email@gmail.com' }, jwtSecret, { expiresIn: resetTokenExp });

  beforeAll(async () => {
    await functions.register(REGISTER_REQ as any, MOCK_RES as any);
  });

  afterAll(async () => {
    const usersQuery = getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTER_REQ.body.email);
    const querySnapshot = await usersQuery.get();
    querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
  });

  // describe('register', () => {
  //   test('[REGISTER] should create a user in db', async () => {
  //     let user: IUser | null = null;
  //     try {
  //       const queryByEmail = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTER_REQ.body.email).get();
  //       const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find((d: any) => !!d);
  //       user = userDocumentSnapshot?.data() as IUser;
  //     } catch (error: any) {
  //       // no action
  //     }
  //     expect(user?.email).toEqual(REGISTER_REQ.body.email);
  //   });

  //   test('[REGISTER] should return 400 when user exists', async () => {
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

  // describe('login', () => {
  //   const LOGIN_MOCK_REQ = {
  //     body: {
  //       email: REGISTER_REQ.body.email,
  //       password: REGISTER_REQ.body.password
  //     }
  //   };

  //   test('[LOGIN] should return status 200 when creds are correct', async () => {
  //     const resetToken = jwt.sign(
  //       { email: REGISTER_REQ.body.email },
  //       process.env[ENV_KEYS.JWT_SECRET] as string,
  //       { expiresIn: resetTokenExp }
  //     );

  //     // @ts-ignore
  //     await functions.registerConfirm({ query: { token: resetToken } }, MOCK_RES as any);

  //     const res = {
  //       status: (code: number) => {
  //         expect(code).toBe(200);
  //         return {
  //           send: (value: any) => { },
  //           json: (value: any) => { }
  //         };
  //       }
  //     };
  //     await functions.login(LOGIN_MOCK_REQ as any, res as any);
  //   }, 10000);

  //   test('[LOGIN] should return status 401 when creds are incorrect', async () => {
  //     const res = {
  //       status: (code: number) => {
  //         expect(code).toBe(401);
  //         return {
  //           send: (value: any) => { },
  //           json: (value: any) => { }
  //         }
  //       }
  //     }
  //     await functions.login(
  //       { body: { email: 'incorrect_email@testmail.com', password: 'incorrect_pwd' } } as any,
  //       res as any
  //     );
  //   });
  // });

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

  // describe('registerConfirm', () => {
  //   test('[REGISTER_CONFIRM] should return 401 if the token is not valid', async () => {
  //     const res = {
  //       status: (code: number) => {
  //         expect(code).toBe(401);
  //         return {
  //           send: (value: any) => { },
  //           json: (value: any) => { }
  //         }
  //       }
  //     };
  //     await functions.registerConfirm({ query: { token: INVALID_CONFIRM_TOKEN_1 } } as any, res as any);
  //   });

  //   test('[REGISTER_CONFIRM] should return 400 if the email is incorrect', async () => {
  //     const res = {
  //       status: (code: number) => {
  //         expect(code).toBe(400);
  //         return {
  //           send: (value: any) => { },
  //           json: (value: any) => { }
  //         }
  //       }
  //     };
  //     await functions.registerConfirm({ query: { token: INVALID_CONFIRM_TOKEN_2 } } as any, res as any);
  //   });

  //   test('[REGISTER_CONFIRM] should return 200 if the token is valid', async () => {
  //     const res = {
  //       status: (code: number) => {
  //         expect(code).toBe(200);
  //         return {
  //           send: (value: any) => { },
  //           json: (value: any) => { }
  //         }
  //       }
  //     };
  //     await functions.registerConfirm({ query: { token: VALID_CONFIRM_TOKEN } } as any, res as any);
  //   });
  // });

  // describe('user', () => {
  //   let USER_ID: string;
  //   let VALID_AUTH_TOKEN: string;
  //   let INVALID_AUTH_TOKEN: string;

  //   beforeAll(async () => {
  //     try {
  //       const queryByEmail = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTER_REQ.body.email).get();
  //       const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find((d: any) => !!d);
  //       USER_ID = userDocumentSnapshot!.id;
  //       VALID_AUTH_TOKEN = 'Bearer ' + jwt.sign({ id: USER_ID }, jwtSecret, { expiresIn: resetTokenExp });
  //     } catch (error: any) {
  //       // no action
  //     }
  //     INVALID_AUTH_TOKEN = 'Bearer ' + jwt.sign({ id: 'incorrect_user_id' }, jwtSecret, { expiresIn: resetTokenExp });
  //   });

  //   test('[GET USER] should return correct user by id', async () => {
  //     const res = {
  //       status: (code: number) => {
  //         return {
  //           send: (value: any) => {
  //             expect(value.data.id).toBe(USER_ID);
  //           },
  //           json: (value: any) => { }
  //         }
  //       }
  //     };
  //     await functions.user({ headers: { authorization: VALID_AUTH_TOKEN as string } } as any, res as any);
  //   });

  //   test('[GET USER] should return 400 if user was not found', async () => {
  //     const res = {
  //       status: (code: number) => {
  //         expect(code).toBe(400);
  //         return {
  //           send: (value: any) => { },
  //           json: (value: any) => { }
  //         }
  //       }
  //     };
  //     await functions.user({ headers: { authorization: INVALID_AUTH_TOKEN as string } } as any, res as any);
  //   });
  // });

  describe('content', () => {
    const testAd = {
      type: 'FOOTER',
      title: 'Test Footer',
      content: 'Test test test test test test test test test test test test'
    };
    const testProduct = {
      id: "1",
      title: "Test1",
      price: 1000,
      createdAt: 1708427169311,
      desc: "Test test test test test test test test test test test test",
      imgUrl: ""
    };
    const testContact = {
      type: "MOBILE",
      value: "test"
    };

    beforeAll(async () => {
      try {
        await getFirestore().collection(COLLECTIONS.ADS).add(testAd);
        await getFirestore().collection(COLLECTIONS.PRODUCTS).add(testProduct);
        await getFirestore().collection(COLLECTIONS.CONTACTS).add(testContact);
      } catch (error: any) {
        // no action
      }
    });

    test('[GET CONTENT] should return correct response', async () => {
      const res = {
        status: (code: number) => {
          return {
            json: (resBody: ResponseBody<IContent>) => {
              console.log(resBody);
              expect(resBody.data[COLLECTIONS.ADS][0].title).toBe(testAd.title);
              expect(resBody.data[COLLECTIONS.PRODUCTS][0].title).toBe(testProduct.title);
              expect(resBody.data[COLLECTIONS.CONTACTS][0].value).toBe(testContact.value);
            }
          }
        }
      };
      await functions.content({ method: 'GET' } as any, res as any);
    });
  });
});
