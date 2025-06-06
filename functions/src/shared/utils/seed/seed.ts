import { getFirestore } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';

import { COLLECTIONS, ENV, ENV_KEYS } from '../../constants';
import localSeeds from './json/seed.local.json';

export const Seed = async (): Promise<void> => {
  switch(process.env[ENV_KEYS.ENVIRONMENT]) {
    case ENV.LOCAL: await populateLocal(); break; // eslint-disable-line
    case ENV.STAGE: await populateStage(); break; // eslint-disable-line
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
    logger.info(`Successfully seeded in env.: ${ENV.LOCAL}`);
  } catch (error: any) {
    logger.error(`Error occured when seeding in env.: ${ENV.LOCAL}`);
  }
}

function populateStage(): void {
  // to be implemented on demand
}
