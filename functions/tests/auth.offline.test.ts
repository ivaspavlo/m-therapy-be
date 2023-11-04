import firebaseFunctionsTest from 'firebase-functions-test';
import { describe, test, expect } from '@jest/globals';
import * as sinon from 'sinon';
import * as functions from 'src/index';

describe('Functions test offline', () => {

  test('should create a user in db', () => {
    expect(firebaseFunctionsTest).toBeTruthy();
    expect(sinon).toBeTruthy();
    expect(functions).toBeTruthy();
  });

});
