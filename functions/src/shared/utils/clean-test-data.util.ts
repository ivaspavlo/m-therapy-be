import { KEYS } from "../constants";

export async function cleanTestData(db: any) {
  const collections = await db.listCollections();

  for (const collectionRef of collections) {
    const querySnapshot = await collectionRef.where(KEYS.TEST_DATA_TAG, '==', true).get();

    if (querySnapshot.empty) {
      continue;
    }

    const batch = db.batch();
    querySnapshot.docs.forEach((doc: any) => batch.delete(doc.ref));

    await batch.commit();

    console.log(`Deleted ${querySnapshot.size} docs from ${collectionRef.id}`);
  }
}
