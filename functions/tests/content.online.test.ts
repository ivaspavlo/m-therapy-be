import * as functions from 'src/index';
import firebaseFunctionsTest from 'firebase-functions-test';
import { describe, expect, beforeAll, test } from '@jest/globals';

import { getFirestore } from 'firebase-admin/firestore';
import { IContent } from 'src/shared/interfaces';
import { COLLECTIONS, ENV_KEYS, KEYS } from 'src/shared/constants';
import { ResponseBody } from 'src/shared/models';
import { cleanTestData } from 'src/shared/utils';

firebaseFunctionsTest({
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, process.env[ENV_KEYS.FIREBASE_SERVICE_ACCOUNT_STAGE] || './stage-service-account-key.json');

const dotenv = require('dotenv');
dotenv.config();

const MOCK_RES = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  setHeader: jest.fn(),
  getHeader: jest.fn(),
  end: jest.fn(),
  on: jest.fn()
};

const MOCK_REQ_HEADERS = {
  origin: 'http://localhost'
};

describe('content', () => {
  const testAd = {
    [KEYS.TEST_DATA_TAG]: true,
    type: 'FOOTER',
    title: 'Test Footer',
    content: 'Test test test test test test test test test test test test'
  };
  const testProduct = {
    [KEYS.TEST_DATA_TAG]: true,
    id: "1",
    title: "Test1",
    price: 1000,
    createdAt: 1708427169311,
    desc: "Test test test test test test test test test test test test",
    imgUrl: ""
  };
  const testContact = {
    [KEYS.TEST_DATA_TAG]: true,
    type: "MOBILE",
    value: "test"
  };
  const testPaymentCard = {
    [KEYS.TEST_DATA_TAG]: true,
    name: "privat",
    number: "5532 3354 1734 2267"
  };

  beforeAll(async () => {
    try {
      await getFirestore().collection(COLLECTIONS.ADS).add(testAd);
      await getFirestore().collection(COLLECTIONS.PRODUCTS).add(testProduct);
      await getFirestore().collection(COLLECTIONS.CONTACTS).add(testContact);
      await getFirestore().collection(COLLECTIONS.PAYMENT_CARDS).add(testPaymentCard);
    } catch (error: any) {
      // no action
    }
  });

  afterAll(async () => {
    await cleanTestData(getFirestore());
  });

  test.skip('[GET CONTENT] should return correct response', async () => {
    const res = {
      ...MOCK_RES,
      status: () => {
        return {
          json: (resBody: ResponseBody<IContent>) => {
            expect(resBody.data[COLLECTIONS.ADS][0].title).toBe(testAd.title);
            expect(resBody.data[COLLECTIONS.PRODUCTS][0].title).toBe(testProduct.title);
            expect(resBody.data[COLLECTIONS.CONTACTS][0].value).toBe(testContact.value);
            expect(resBody.data[COLLECTIONS.PAYMENT_CARDS][0].number).toBe(testPaymentCard.number);
          }
        }
      }
    };
    await functions.content({ headers: {...MOCK_REQ_HEADERS}, method: 'GET' } as any, res as any);
  });
});
