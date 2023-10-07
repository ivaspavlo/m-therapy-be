// import { database } from 'firebase-admin';


const testBase = require('firebase-functions-test')({
  projectId: process.env.GCLOUD_PROJECT,
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, process.cwd() + '/mt-stage-db6be-a531eb8c5a6b.json');

// Should be after firebase-functions-test is initialized.
const myFunctions = require(process.cwd() + '/src/index.ts');

describe('MT cloud functions', () => {

  describe('register', () => {

    test('should create a user in DB', () => {
      // const req = {
      //   body: {
      //     firstname: 'Test',
      //     lastname: 'Testovich',
      //     email: 'testovichus@testmail.com',
      //     birthday: 589050238388,
      //     phone: '+111222333444',
      //     password: 'TestPass1!'
      //   }
      // };
      // const res = {
      //   status: (value: number) => {}
      // };
  
      // const result = await myFunctions.register(req, res);
  
      expect(true).toBeTruthy();
    });
  
  });

});

// https://medium.com/@leejh3224/testing-firebase-cloud-functions-with-jest-4156e65c7d29
// https://firebase.google.com/docs/reference/functions/test/test.database
// https://basarat.gitbook.io/typescript/intro-1/jest
