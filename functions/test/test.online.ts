import { database } from 'firebase-admin';
import { assert } from 'chai';


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

  describe('register function', () => {
    it('should return true', () => {

      // Create a DataSnapshot with the value 'input' and the reference path 'messages/11111/original'.
      const snap = testBase.database.makeDataSnapshot('input', 'messages/11111/original');
      console.log(snap);
      console.log(myFunctions);
      assert.equal(true, true);

      // Wrap the makeUppercase function
      // const wrapped = test.wrap(myFunctions.makeUppercase);
      // Call the wrapped function with the snapshot you constructed.
      // return wrapped(snap).then(() => {
        // Read the value of the data at messages/11111/uppercase. Because `admin.initializeApp()` is
        // called in functions/index.js, there's already a Firebase app initialized. Otherwise, add
        // `admin.initializeApp()` before this line.
        // return database().ref('messages/11111/uppercase').once('value').then((createdSnap) => {
          // Assert that the value is the uppercased version of our input.
      //     assert.equal(createdSnap.val(), 'INPUT');
      //   });
      // });
    })
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
