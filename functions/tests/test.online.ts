import { DocumentData, QueryDocumentSnapshot, getFirestore } from 'firebase-admin/firestore';

// @ts-ignore
const testBase = require('firebase-functions-test')({
  projectId: process.env.GCLOUD_PROJECT,
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, `${__dirname}/../mt-stage-db6be-a531eb8c5a6b.json`);

// Should be after firebase-functions-test is initialized.
const myFunctions = require(`${__dirname}/../src/index.ts`);

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
    });

    test('should create a user in db', async () => {
      await myFunctions.register(MOCK_REQ, MOCK_RES);
      let user: any;
      try {
        const queryByEmail = await getFirestore().collection('users').where('email', '==', MOCK_REQ.body.email).get();
        const userDocumentSnapshot: QueryDocumentSnapshot | undefined = queryByEmail.docs.find((d: any) => !!d);
        user = userDocumentSnapshot?.data();
      } catch (error: any) {
        user = null;
      }
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
      await myFunctions.register(MOCK_REQ, res);
    });
  
  });

});

// https://medium.com/@leejh3224/testing-firebase-cloud-functions-with-jest-4156e65c7d29
// https://firebase.google.com/docs/reference/functions/test/test.database
// https://basarat.gitbook.io/typescript/intro-1/jest
// https://stackoverflow.com/questions/70442193/error-wrap-function-is-only-available-for-oncall-http-functions-not-onreque
// https://medium.com/@leejh3224/testing-firebase-cloud-functions-with-jest-4156e65c7d29
// https://medium.com/practical-coding/set-up-gitlab-ci-cd-for-testing-your-firebase-functions-49878b3e7764
// https://timo-santi.medium.com/jest-testing-firebase-functions-with-emulator-suite-409907f31f39
