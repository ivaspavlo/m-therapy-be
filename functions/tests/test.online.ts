import { describe, expect, afterAll, test } from '@jest/globals';
import firebaseFunctionsTest from 'firebase-functions-test';
import { DocumentData, QueryDocumentSnapshot, getFirestore } from 'firebase-admin/firestore';

import * as functions from '../src/index';
import { IUser } from '../src/shared/interfaces';

firebaseFunctionsTest({
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, './mt-stage-db6be-a531eb8c5a6b.json');

describe('MT cloud functions', () => {

  describe('register', () => {

    const MOCK_REQ = {
      body: {
        firstname: 'Test',
        lastname: 'Testovich',
        email: 'testovichus@testmail.com',
        birthday: 589050238388,
        phone: '+111222333444',
        password: 'TestPass1!'
      }
    };
    const MOCK_RES = {
      status: (code: number) => ({
        send: (value: any) => {},
        json: (value: any) => {}
      })
    };

    afterAll(async () => {
      const usersQuery = getFirestore().collection('users').where('email', '==', MOCK_REQ.body.email);
      const querySnapshot = await usersQuery.get();
      querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
      // console.log(register, remind, login, reset);
    });

    test('should create a user in db', async () => {
      await functions.register(MOCK_REQ as any, MOCK_RES as any);
      let user: IUser | null = null;
      try {
        const queryByEmail = await getFirestore().collection('users').where('email', '==', MOCK_REQ.body.email).get();
        const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find((d: any) => !!d);
        user = userDocumentSnapshot?.data() as IUser;
      } catch (error: any) { }

      expect(user?.email).toEqual(MOCK_REQ.body.email);
    });

    test('should return 400 when user exists', async () => {
      const res = {
        status: (code: number) => {
          expect(code).toBe(400);
          return {
            send: (value: any) => {},
            json: (value: any) => {}
          };
        }
      };
      await functions.register(MOCK_REQ as any, res as any);
    });
  
  });

});
