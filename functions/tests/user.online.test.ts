import * as jwt from 'jsonwebtoken';
import * as functions from 'src/index';
import dotenv from 'dotenv';
import firebaseFunctionsTest from 'firebase-functions-test';
import { defineString } from 'firebase-functions/params';
import { DocumentData, QueryDocumentSnapshot, getFirestore } from 'firebase-admin/firestore';
import { describe, expect, afterAll, beforeAll, test } from '@jest/globals';
import { ENV_KEYS, COLLECTIONS } from 'src/shared/constants';
import { ResponseBody } from 'src/shared/models';
import { IUser } from 'src/shared/interfaces';
import { ISubscriber } from 'src/user/user.interface';


firebaseFunctionsTest({
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, process.env.FIREBASE_SERVICE_ACCOUNT || './mt-stage-db6be-a531eb8c5a6b.json');

dotenv.config({ path: './.env.local' });

const resetTokenExp = defineString(ENV_KEYS.RESET_TOKEN_EXP).value();
const jwtSecret = defineString(ENV_KEYS.JWT_SECRET).value();

const REGISTERED_USER = {
  firstname: 'Test',
  lastname: 'Testovich',
  email: 'test@testmail.com',
  birthday: '1990-08-08',
  phone: '+111222333444',
  password: 'TestPass1!',
  lang: 'en',
  hasUserConsent: true,
  hasEmailConsent: true
};

describe('user', () => {
  let USER_ID: string;
  let VALID_AUTH_TOKEN: string;
  let INVALID_AUTH_TOKEN_1: string;
  let INVALID_AUTH_TOKEN_2: string;

  beforeAll(async () => {
    await getFirestore().collection(COLLECTIONS.USERS).add(REGISTERED_USER);
    try {
      const queryByEmail = await getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTERED_USER.email).get();
      const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find((d: any) => !!d);
      USER_ID = userDocumentSnapshot!.id;
      VALID_AUTH_TOKEN = 'Bearer ' + jwt.sign({ id: USER_ID }, jwtSecret, { expiresIn: resetTokenExp });
    } catch (error: any) {
      // no action
    }
    INVALID_AUTH_TOKEN_1 = 'Bearer ' + jwt.sign({ id: 'incorrect_user_id' }, jwtSecret, { expiresIn: resetTokenExp });
    INVALID_AUTH_TOKEN_2 = 'Bearer ' + jwt.sign({ id: 'mock_user_id' }, 'invalid_jwt', { expiresIn: resetTokenExp });
  });

  afterAll(async () => {
    // clear mocked users
    const usersQuery = getFirestore().collection(COLLECTIONS.USERS).where('email', '==', REGISTERED_USER  .email);
    const querySnapshot = await usersQuery.get();
    querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
  });

  test('[GET USER] should return correct user by id', async () => {
    const res = {
      status: (code: number) => {
        return {
          send: (value: any) => {
            expect(value.data.id).toBe(USER_ID);
          },
          json: (value: any) => { }
        }
      }
    };
    await functions.user({ headers: { authorization: VALID_AUTH_TOKEN as string }, method: 'GET' } as any, res as any);
  });

  test('[GET USER] should return 400 if user was not found', async () => {
    const res = {
      status: (code: number) => {
        expect(code).toBe(400);
        return {
          send: (value: any) => { },
          json: (value: any) => { }
        }
      }
    };
    await functions.user({ headers: { authorization: INVALID_AUTH_TOKEN_1 as string }, method: 'GET' } as any, res as any);
  });

  test('[PUT USER] should return 401 if token is invalid', async () => {
    const res = {
      status: (code: number) => {
        expect(code).toBe(401);
        return {
          send: (value: any) => { },
          json: (value: any) => { }
        }
      }
    };
    await functions.user({ headers: { authorization: INVALID_AUTH_TOKEN_2 as string }, method: 'PUT' } as any, res as any);
  });

  test('[PUT USER] should return 400 if fields are invalid', async () => {
    const res = {
      status: (code: number) => {
        expect(code).toBe(400);
        return {
          send: (value: any) => { },
          json: (value: any) => { }
        }
      } 
    };
    await functions.user({
      headers: { authorization: VALID_AUTH_TOKEN as string },
      method: 'PUT',
      body: { firstname: false }
    } as any,
    res as any
    );
  });

  test('[PUT USER] should return updated user', async () => {
    const newValueForFirstname = 'mockName';
    const res = {
      status: (code: number) => {
        return {
          send: (value: ResponseBody<IUser>) => {
            expect(value.data.firstname).toBe(newValueForFirstname);
          },
          json: (value: any) => { }
        }
      }
    };
    await functions.user({
      headers: { authorization: VALID_AUTH_TOKEN as string },
      method: 'PUT',
      body: { firstname: newValueForFirstname }
    } as any,
    res as any
    );
  });

  test('[PUT USER] should save the updated user in DB', async () => {
    const newValueForFirstname = 'mockName';
    const res = {
      status: (code: number) => {
        return {
          send: (value: any) => { },
          json: (value: any) => { }
        }
      }
    };
    await functions.user({
      headers: { authorization: VALID_AUTH_TOKEN as string },
      method: 'PUT',
      body: { firstname: newValueForFirstname }
    } as any,
    res as any
    );
    const userDocumentSnapshot = (await getFirestore().collection(COLLECTIONS.USERS).doc(USER_ID).get());
    expect (userDocumentSnapshot.data()?.firstname).toBe(newValueForFirstname);
  });
});

describe('subscriber', () => {
  const newValueForEmail = 'mockEmail@gmail.com';

  afterEach(async () => {
    // clear mocked subscriber
    const usersQuery = getFirestore().collection(COLLECTIONS.SUBSCRIBERS).where('email', '==', newValueForEmail);
    const querySnapshot = await usersQuery.get();
    querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
  });

  test('[POST USER SUBSCRIBE] should return created subscriber', async () => {
    const res = {
      status: (code: number) => {
        return {
          send: (value: ResponseBody<ISubscriber>) => {
            expect(value.data.email).toBe(newValueForEmail);
          },
          json: () => { }
        }
      }
    };
    await functions.user({
      method: 'POST',
      url: '/subscribe',
      body: { email: newValueForEmail }
    } as any,
    res as any
    );
  });

  test('[POST USER SUBSCRIBE] should return an error if subscriber already exists', async () => {
    const res_1 = {
      status: (code: number) => ({ send: (value: any) => { }, json: (value: any) => { }})
    };
    const res_2 = {
      status: (code: number) => {
        expect(code).toBe(400);
        return {send: (value: any) => { }, json: (value: any) => { }}
      }
    }
    await functions.user({
      method: 'POST',
      url: '/subscribe',
      body: { email: newValueForEmail }
    } as any,
    res_1 as any
    );
    await functions.user({
      method: 'POST',
      url: '/subscribe',
      body: { email: newValueForEmail }
    } as any,
    res_2 as any
    );
  });

  test('[POST USER SUBSCRIBE] should save subscirber in DB', async () => {
    const res = {
      status: (code: number) => {
        return {
          send: (value: any) => { },
          json: (value: any) => { }
        }
      }
    };
    await functions.user({
      method: 'POST',
      url: '/subscribe',
      body: { email: newValueForEmail }
    } as any,
    res as any
    );
    const usersQuery = getFirestore().collection(COLLECTIONS.SUBSCRIBERS).where('email', '==', newValueForEmail);
    const querySnapshot = await usersQuery.get();
    const subscirber: ISubscriber = querySnapshot.docs.find((doc: DocumentData) => !!doc)?.data() as ISubscriber;
    expect(subscirber?.email).toBe(newValueForEmail);
  });

  test('[DELETE USER UNSUBSCRIBE] should delete subscirber in DB', async () => {
    const mockSubscriberId = 'mockSubscriberId';
    const unsubscribeToken = jwt.sign({id: mockSubscriberId}, jwtSecret, {expiresIn: resetTokenExp});
    await getFirestore().collection(COLLECTIONS.SUBSCRIBERS).doc(mockSubscriberId).set({email: newValueForEmail});
    const res = {
      status: () => {
        return {
          send: () => {},
          json: () => {}
        }
      }
    };
    await functions.user({
      method: 'DELETE',
      url: '/unsubscribe',
      body: {token: unsubscribeToken}
    } as any,
    res as any
    );
    const test = await getFirestore().collection(COLLECTIONS.SUBSCRIBERS).doc(mockSubscriberId).get();
    expect(test.exists).toBe(false);
  });

  test('[DELETE USER UNSUBSCRIBE] should set hasEmailConsent flag to false in the user instance', async () => {
    const mockSubscriberId = 'mockSubscriberId';
    await getFirestore().collection(COLLECTIONS.USERS).doc(mockSubscriberId).set(REGISTERED_USER);
    const unsubscribeToken = jwt.sign({id: mockSubscriberId}, jwtSecret, {expiresIn: resetTokenExp});
    const res = {
      status: () => {
        return {
          send: () => {},
          json: () => {}
        }
      }
    };
    await functions.user({
      method: 'DELETE',
      url: '/unsubscribe',
      body: {token: unsubscribeToken}
    } as any,
    res as any
    );
    const test = await getFirestore().collection(COLLECTIONS.USERS).doc(mockSubscriberId).get();
    const user = test.data();
    expect(user?.hasEmailConsent).toBe(false);
    // cleanup
    await getFirestore().collection(COLLECTIONS.USERS).doc(mockSubscriberId).delete();
  });

  test('[DELETE USER UNSUBSCRIBE] should set return 400 if no user or subscriber found by id', async () => {
    
  });
});
