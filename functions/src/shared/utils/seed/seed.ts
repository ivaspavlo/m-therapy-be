import { defineString } from 'firebase-functions/params';
import { getFirestore } from 'firebase-admin/firestore';
import { COLLECTIONS, ENV, ENV_KEYS } from '../../constants';
import * as logger from 'firebase-functions/logger';
import localSeeds from './json/seed.local.json';


const currentEnv = defineString(ENV_KEYS.ENVIRONMENT);

export const Seed = async (): Promise<void> => {
  switch(currentEnv.value()) {
    case ENV.LOCAL: await populateLocal(); break; // eslint-disable-line
    case ENV.STAGE: await populateStage(); break; // eslint-disable-line
  }
};

async function populateLocal(): Promise<void> {
  const db = getFirestore();

  Object.values(COLLECTIONS).forEach(async (collName: string) => {
    const collection = db.collection(collName);
    const docs = await db.collection(collName).listDocuments();
    if (docs.length) {
      return;
    }
    // @ts-ignore
    const seeds: any[] = localSeeds[collName];
    if (!seeds) {
      return;
    }
    try {
      seeds.forEach(async (item: any) => await collection.add(item));
      logger.info(`Successfully seeded in env.: ${ENV.LOCAL}`);
    } catch (e: any) {
      logger.error(`Error occured when seeding in env.: ${ENV.LOCAL}`);
    }
  });
}

function populateStage(): void {
  
}
