import { getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';

import { COLLECTIONS, ENV_KEYS } from '../../constants';
import localSeeds from './seed.local.json';

export const Seed = async (): Promise<void> => {
  if (process.env[ENV_KEYS.IS_LOCAL]) {
    await populateLocal();
  }
};

async function populateLocal(): Promise<void> {
  const db = getFirestore();

  try {
    Object.values(COLLECTIONS).forEach(async (name: string) => {
      const collection = db.collection(name);
      const docs = await db.collection(name).listDocuments();
      if (docs.length) {
        return;
      }
      // @ts-ignore
      const seeds: any[] = localSeeds[name];
      if (!seeds) {
        return;
      }
      seeds.forEach(async (item: any) => await collection.add(item));
    });
    logger.info(`Successfully seeded}`);
  } catch (error: any) {
    logger.error(`Error occured when seeding: ${error}`);
  }
}
