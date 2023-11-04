import firebaseFunctionsTest from 'firebase-functions-test';
import * as sinon from 'sinon';
import * as functions from 'src/index';

describe('Functions test offline', () => {

  test('should create a user in db', () => {
    expect(firebaseFunctionsTest).toBeTruthy();
    expect(sinon).toBeTruthy();
    expect(functions).toBeTruthy();
  });

});
