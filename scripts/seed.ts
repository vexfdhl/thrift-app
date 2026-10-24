import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { INITIAL_THRIFT_STORES } from '../src/data/thriftStores';
import configJson from '../firebase-applet-config.json';

const app = initializeApp(configJson);
const db = getFirestore(app, configJson.firestoreDatabaseId);

async function seed() {
  console.log(`Checking Firestore stores collection for database: ${configJson.firestoreDatabaseId}`);
  const snap = await getDocs(collection(db, 'stores'));
  console.log(`Current stores count in Firestore: ${snap.size}`);

  for (const store of INITIAL_THRIFT_STORES) {
    const storeRef = doc(db, 'stores', store.id);
    await setDoc(storeRef, {
      ...store,
      isPublished: true,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`✓ Seeded/Updated store: ${store.name} (${store.id})`);
  }

  const finalSnap = await getDocs(collection(db, 'stores'));
  console.log(`Final stores count in Firestore: ${finalSnap.size}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
