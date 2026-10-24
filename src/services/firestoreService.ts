import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { ThriftStoreItem, INITIAL_THRIFT_STORES, ReviewItem } from '../data/thriftStores';

const STORES_COLLECTION = 'stores';
const REVIEWS_COLLECTION = 'reviews';

/**
 * Seed only authentic stores from Mags's PDF to Firestore and prune any non-PDF items
 */
export async function seedInitialStoresToFirestore(): Promise<void> {
  try {
    const existingSnap = await getDocs(collection(db, STORES_COLLECTION));
    const pdfIds = new Set(INITIAL_THRIFT_STORES.map(s => s.id));

    // Prune any legacy non-PDF store documents
    for (const docSnap of existingSnap.docs) {
      if (!pdfIds.has(docSnap.id)) {
        await deleteDoc(doc(db, STORES_COLLECTION, docSnap.id));
      }
    }

    const existingIds = new Set(existingSnap.docs.map(d => d.id));

    const promises = INITIAL_THRIFT_STORES.map(async (store) => {
      const storeRef = doc(db, STORES_COLLECTION, store.id);
      if (!existingIds.has(store.id)) {
        await setDoc(storeRef, {
          ...store,
          isPublished: store.isPublished ?? true,
          updatedAt: serverTimestamp(),
        });
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.warn('Could not auto-seed stores to Firestore (using local fallback):', error);
  }
}

/**
 * Real-time subscription to thrift stores.
 * Guarantees that only stores from Mags's PDF are listed in the directory!
 */
export function subscribeToStores(
  onUpdate: (stores: ThriftStoreItem[]) => void
): () => void {
  // Immediately call with initial PDF stores so user never sees empty screen
  onUpdate(INITIAL_THRIFT_STORES);

  // Auto-seed and prune non-PDF stores in background
  seedInitialStoresToFirestore();

  try {
    const storesRef = collection(db, STORES_COLLECTION);
    const unsubscribe = onSnapshot(
      storesRef,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(INITIAL_THRIFT_STORES);
          return;
        }

        const firestoreMap = new Map<string, ThriftStoreItem>();
        snapshot.forEach((docSnap) => {
          firestoreMap.set(docSnap.id, { id: docSnap.id, ...(docSnap.data() as any) });
        });

        // Merge only authentic PDF stores: use Firestore updates if available, else local
        const merged: ThriftStoreItem[] = INITIAL_THRIFT_STORES.map((initialStore) => {
          if (firestoreMap.has(initialStore.id)) {
            return firestoreMap.get(initialStore.id)!;
          }
          return initialStore;
        });

        onUpdate(merged);
      },
      (error) => {
        console.warn('Firestore subscription error (falling back to initial PDF stores):', error);
        onUpdate(INITIAL_THRIFT_STORES);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Failed to start Firestore listener:', err);
    return () => {};
  }
}

/**
 * Create or update a store in Firestore
 */
export async function createOrUpdateStore(store: ThriftStoreItem): Promise<void> {
  const storeRef = doc(db, STORES_COLLECTION, store.id);
  await setDoc(storeRef, {
    ...store,
    isPublished: store.isPublished ?? true,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

/**
 * Delete a store from Firestore
 */
export async function deleteStore(storeId: string): Promise<void> {
  const storeRef = doc(db, STORES_COLLECTION, storeId);
  await deleteDoc(storeRef);
}

/**
 * Toggle published state of a store
 */
export async function setStorePublished(storeId: string, isPublished: boolean): Promise<void> {
  const storeRef = doc(db, STORES_COLLECTION, storeId);
  await updateDoc(storeRef, { isPublished });
}

/**
 * Real-time subscription to all student reviews across stores
 */
export function subscribeToReviews(
  onUpdate: (reviews: (ReviewItem & { storeId: string; status?: 'approved' | 'hidden' | 'pending' })[]) => void
): () => void {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    return onSnapshot(
      reviewsRef,
      (snapshot) => {
        const reviewsList: (ReviewItem & { storeId: string; status?: 'approved' | 'hidden' | 'pending' })[] = [];
        snapshot.forEach((docSnap) => {
          reviewsList.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        onUpdate(reviewsList);
      },
      (err) => {
        console.warn('Reviews subscription error:', err);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * Submit a student review to Firestore
 */
export async function submitReviewToFirestore(
  storeId: string,
  review: ReviewItem
): Promise<void> {
  const reviewRef = doc(db, REVIEWS_COLLECTION, review.id);
  await setDoc(reviewRef, {
    ...review,
    storeId,
    status: 'approved', // Default published
    createdAt: serverTimestamp(),
  });
}

/**
 * Moderate review status (approve, hide, delete)
 */
export async function updateReviewStatus(
  reviewId: string,
  status: 'approved' | 'hidden'
): Promise<void> {
  const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
  await updateDoc(reviewRef, { status });
}

export async function deleteReviewFromFirestore(reviewId: string): Promise<void> {
  const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId);
  await deleteDoc(reviewRef);
}
