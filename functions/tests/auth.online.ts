import { describe, expect, afterAll, beforeAll, test } from '@jest/globals';
import { DocumentData, QueryDocumentSnapshot, getFirestore } from 'firebase-admin/firestore';
import firebaseFunctionsTest from 'firebase-functions-test';
import dotenv from 'dotenv';

import * as functions from 'src/index';
import { IUser } from 'src/shared/interfaces';


firebaseFunctionsTest({
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, './mt-stage-db6be-a531eb8c5a6b.json');

dotenv.config({ path: './.env.local' });

describe('MT cloud functions', () => {

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
      birthday: 589050238388,
      phone: '+111222333444',
      password: 'TestPass1!'
    }
  };

  describe('register', () => {

    afterAll(async () => {
      const usersQuery = getFirestore().collection('users').where('email', '==', REGISTER_REQ.body.email);
      const querySnapshot = await usersQuery.get();
      querySnapshot.forEach((doc: DocumentData) => doc.ref.delete());
    });

    test('should create a user in db', async () => {
      await functions.register(REGISTER_REQ as any, MOCK_RES as any);
      let user: IUser | null = null;
      try {
        const queryByEmail = await getFirestore().collection('users').where('email', '==', REGISTER_REQ.body.email).get();
        const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find((d: any) => !!d);
        user = userDocumentSnapshot?.data() as IUser;
      } catch (error: any) { }

      expect(user?.email).toEqual(REGISTER_REQ.body.email);
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
      await functions.register(REGISTER_REQ as any, res as any);
    });

  });

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

    test('should return 200 when creds are correct', async () => {
      console.log(process.env);
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
  });

});
