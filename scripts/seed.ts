import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, deleteDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { INITIAL_THRIFT_STORES } from '../src/data/thriftStores';
import configJson from '../firebase-applet-config.json';

const app = initializeApp(configJson);
const db = getFirestore(app, configJson.firestoreDatabaseId);

async function seed() {
  console.log(`Checking Firestore stores collection for database: ${configJson.firestoreDatabaseId}`);
  const snap = await getDocs(collection(db, 'stores'));
  console.log(`Current stores count in Firestore: ${snap.size}`);

  const pdfStoreIds = new Set(INITIAL_THRIFT_STORES.map(s => s.id));

  // 1. Remove any legacy or non-PDF stores
  for (const docSnap of snap.docs) {
    if (!pdfStoreIds.has(docSnap.id)) {
      console.log(`Removing non-PDF store: ${docSnap.id}`);
      await deleteDoc(doc(db, 'stores', docSnap.id));
    }
  }

  // 2. Seed/Update only authentic PDF stores
  for (const store of INITIAL_THRIFT_STORES) {
    const storeRef = doc(db, 'stores', store.id);
    await setDoc(storeRef, {
      ...store,
      isPublished: true,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log(`✓ Verified PDF store: ${store.name} (${store.id})`);
  }

  const finalSnap = await getDocs(collection(db, 'stores'));
  console.log(`Final stores count in Firestore (matching PDF): ${finalSnap.size}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
