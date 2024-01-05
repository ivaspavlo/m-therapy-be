import { defineString } from 'firebase-functions/params';
import { getFirestore } from 'firebase-admin/firestore';
import { COLLECTIONS, ENV_KEYS } from '../../shared/constants';
// import localSeeds from './json/seed.local.json';


const currentEnv = defineString(ENV_KEYS.ENVIRONMENT);

export const Seed = async (): Promise<void> => {
  const db = getFirestore();
  if (currentEnv.value() === 'LOCAL') {
    const existingDocs = await db.collection(COLLECTIONS.USERS).listDocuments();
    existingDocs.forEach(doc => doc.delete());
    await getFirestore().collection(COLLECTIONS.USERS).add({ id: 1 });
  }
};
