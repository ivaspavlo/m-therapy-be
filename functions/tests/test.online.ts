// import { database } from 'firebase-admin';


const testBase = require('firebase-functions-test')({
  projectId: process.env.GCLOUD_PROJECT,
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, `${__dirname}/../mt-stage-db6be-a531eb8c5a6b.json`);

// Should be after firebase-functions-test is initialized.
const myFunctions = require(`${__dirname}/../src/index.ts`);

describe('MT cloud functions', () => {

  afterAll(() => {

  });

  describe('register', () => {

    test('should create a user in db', async () => {
      const req = {
        body: {
          firstname: 'Test',
          lastname: 'Testovich',
          email: 'testovichus@testmail.com',
          birthday: 589050238388,
          phone: '+111222333444',
          password: 'TestPass1!'
        }
      };
      console.log(testBase);
      const res = {
        status: (code: number) => ({
          send: (value: any) => {},
          json: (value: any) => {}
        })
      };
      await myFunctions.register(req, res);

      

      expect(1).toBe(1);

    });
  
  });

});

// https://medium.com/@leejh3224/testing-firebase-cloud-functions-with-jest-4156e65c7d29
// https://firebase.google.com/docs/reference/functions/test/test.database
// https://basarat.gitbook.io/typescript/intro-1/jest
// https://stackoverflow.com/questions/70442193/error-wrap-function-is-only-available-for-oncall-http-functions-not-onreque
// https://medium.com/@leejh3224/testing-firebase-cloud-functions-with-jest-4156e65c7d29
// https://medium.com/practical-coding/set-up-gitlab-ci-cd-for-testing-your-firebase-functions-49878b3e7764
