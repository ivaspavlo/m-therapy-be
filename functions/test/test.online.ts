import { database } from 'firebase-admin';
// import { assert } from 'chai';


const testBase = require('firebase-functions-test')({
  projectId: process.env.GCLOUD_PROJECT,
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, process.cwd() + '/mt-stage-db6be-a531eb8c5a6b.json');

// Should be after firebase-functions-test is initialized.
const myFunctions = require(process.cwd() + '/src/index.ts');

describe('MT online test suite', () => {

  before(() => { });

  after(() => {
    database().ref('messages').remove();
    testBase.cleanup();
  });

  describe('register', () => {

    it('should create a user in DB', async () => {
      debugger;
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
      const res = {
        status: (value: number) => {}
      };

      const result = await myFunctions.register(req, res);
      console.log(result);
    });
  
  });

  // describe('addMessage', () => {
  //   it('should return a 303 redirect', (done) => {
  //     // A fake request object, with req.query.text set to 'input'
  //     const req = { query: {text: 'input'} };
  //     // A fake response object, with a stubbed redirect function which does some assertions
  //     const res = {
  //       redirect: (code, url) => {
  //         // Assert code is 303
  //         assert.equal(code, 303);
  //         // If the database push is successful, then the URL sent back will have the following format:
  //         const expectedRef = new RegExp(projectConfig.databaseURL + '/messages/');
  //         assert.isTrue(expectedRef.test(url));
  //         done();
  //       }
  //     };

  //     // Invoke addMessage with our fake request and response objects. This will cause the
  //     // assertions in the response object to be evaluated.
  //     myFunctions.addMessage(req, res);
  //   });
  // });
})

// https://medium.com/@leejh3224/testing-firebase-cloud-functions-with-jest-4156e65c7d29
// https://firebase.google.com/docs/reference/functions/test/test.database
