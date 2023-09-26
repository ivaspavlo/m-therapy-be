import { database } from 'firebase-admin';
import { assert } from 'chai';


const projectConfig = {
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
};
const test = require('firebase-functions-test')(projectConfig, './service-account-key.json');

describe('Cloud Functions', () => {
  let myFunctions;

  before(() => {
    // Require index.js and save the exports inside a namespace called myFunctions.
    // This includes our cloud functions, which can now be accessed at myFunctions.makeUppercase
    // and myFunctions.addMessage
    myFunctions = require('../index');
  });

  after(() => {
    // Do cleanup tasks.
    test.cleanup();
    // Reset the database.
    database().ref('messages').remove();
  });

  describe('makeUpperCase', () => {
    // Test Case: setting messages/11111/original to 'input' should cause 'INPUT' to be written to
    // messages/11111/uppercase
    it('should upper case input and write it to /uppercase', () => {
      // [START assertOnline]
      // Create a DataSnapshot with the value 'input' and the reference path 'messages/11111/original'.
      const snap = test.database.makeDataSnapshot('input', 'messages/11111/original');

      // Wrap the makeUppercase function
      const wrapped = test.wrap(myFunctions.makeUppercase);
      // Call the wrapped function with the snapshot you constructed.
      return wrapped(snap).then(() => {
        // Read the value of the data at messages/11111/uppercase. Because `admin.initializeApp()` is
        // called in functions/index.js, there's already a Firebase app initialized. Otherwise, add
        // `admin.initializeApp()` before this line.
        return database().ref('messages/11111/uppercase').once('value').then((createdSnap) => {
          // Assert that the value is the uppercased version of our input.
          assert.equal(createdSnap.val(), 'INPUT');
        });
      });
      // [END assertOnline]
    })
  });

  describe('addMessage', () => {
    it('should return a 303 redirect', (done) => {
      // A fake request object, with req.query.text set to 'input'
      const req = { query: {text: 'input'} };
      // A fake response object, with a stubbed redirect function which does some assertions
      const res = {
        redirect: (code, url) => {
          // Assert code is 303
          assert.equal(code, 303);
          // If the database push is successful, then the URL sent back will have the following format:
          const expectedRef = new RegExp(projectConfig.databaseURL + '/messages/');
          assert.isTrue(expectedRef.test(url));
          done();
        }
      };

      // Invoke addMessage with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      myFunctions.addMessage(req, res);
    });
  });
})
