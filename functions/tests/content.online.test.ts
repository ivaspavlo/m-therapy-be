import * as functions from 'src/index';
import dotenv from 'dotenv';
import firebaseFunctionsTest from 'firebase-functions-test';
import { describe, expect, beforeAll, test } from '@jest/globals';
import { getFirestore } from 'firebase-admin/firestore';
import { IContent } from 'src/shared/interfaces';
import { COLLECTIONS } from 'src/shared/constants';
import { ResponseBody } from 'src/shared/models';


firebaseFunctionsTest({
  projectId: 'mt-stage-db6be',
  databaseURL: 'https://mt-stage-db6be.firebaseio.com'
}, process.env.FIREBASE_SERVICE_ACCOUNT || './mt-stage-db6be-a531eb8c5a6b.json');

dotenv.config({ path: './.env.local' });

describe.skip('content', () => {
  const testAd = {
    type: 'FOOTER',
    title: 'Test Footer',
    content: 'Test test test test test test test test test test test test'
  };
  const testProduct = {
    id: "1",
    title: "Test1",
    price: 1000,
    createdAt: 1708427169311,
    desc: "Test test test test test test test test test test test test",
    imgUrl: ""
  };
  const testContact = {
    type: "MOBILE",
    value: "test"
  };

  beforeAll(async () => {
    try {
      await getFirestore().collection(COLLECTIONS.ADS).add(testAd);
      await getFirestore().collection(COLLECTIONS.PRODUCTS).add(testProduct);
      await getFirestore().collection(COLLECTIONS.CONTACTS).add(testContact);
    } catch (error: any) {
      // no action
    }
  });

  test('[GET CONTENT] should return correct response', async () => {
    const res = {
      status: (code: number) => {
        return {
          json: (resBody: ResponseBody<IContent>) => {
            expect(resBody.data[COLLECTIONS.ADS][0].title).toBe(testAd.title);
            expect(resBody.data[COLLECTIONS.PRODUCTS][0].title).toBe(testProduct.title);
            expect(resBody.data[COLLECTIONS.CONTACTS][0].value).toBe(testContact.value);
          }
        }
      }
    };
    await functions.content({ method: 'GET' } as any, res as any);
  });
});
