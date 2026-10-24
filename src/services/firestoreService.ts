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
 * Seed all initial 15 thrift stores to Firestore if they do not exist
 */
export async function seedInitialStoresToFirestore(): Promise<void> {
  try {
    const existingSnap = await getDocs(collection(db, STORES_COLLECTION));
    const existingIds = new Set(existingSnap.docs.map(d => d.id));

    const promises = INITIAL_THRIFT_STORES.map(async (store) => {
      if (!existingIds.has(store.id)) {
        const storeRef = doc(db, STORES_COLLECTION, store.id);
        await setDoc(storeRef, {
          ...store,
          isPublished: store.isPublished ?? true,
          updatedAt: serverTimestamp(),
        });
      }
    });

    await Promise.all(promises);
    console.log('Successfully verified/seeded all 15 stores in Firestore.');
  } catch (error) {
    console.warn('Could not auto-seed stores to Firestore (using local fallback):', error);
  }
}

/**
 * Real-time subscription to thrift stores.
 * Merges Firestore documents with INITIAL_THRIFT_STORES so all 15 stores are always preserved!
 */
export function subscribeToStores(
  onUpdate: (stores: ThriftStoreItem[]) => void
): () => void {
  // Immediately call with initial 15 stores so user never sees empty screen
  onUpdate(INITIAL_THRIFT_STORES);

  // Auto-seed missing stores in background
  seedInitialStoresToFirestore();

  try {
    const storesRef = collection(db, STORES_COLLECTION);
    const unsubscribe = onSnapshot(
      storesRef,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore collection has 0 documents, show all 15 initial stores
          onUpdate(INITIAL_THRIFT_STORES);
          return;
        }

        const firestoreMap = new Map<string, ThriftStoreItem>();
        snapshot.forEach((docSnap) => {
          firestoreMap.set(docSnap.id, { id: docSnap.id, ...(docSnap.data() as any) });
        });

        // Merge: Start with INITIAL_THRIFT_STORES, override with any Firestore edits
        const merged: ThriftStoreItem[] = [];
        const seenIds = new Set<string>();

        INITIAL_THRIFT_STORES.forEach((initialStore) => {
          seenIds.add(initialStore.id);
          if (firestoreMap.has(initialStore.id)) {
            const fsStore = firestoreMap.get(initialStore.id)!;
            merged.push(fsStore);
          } else {
            merged.push(initialStore);
          }
        });

        // Also add any completely new stores created by admin in Firestore
        firestoreMap.forEach((fsStore, id) => {
          if (!seenIds.has(id)) {
            merged.push(fsStore);
          }
        });

        onUpdate(merged);
      },
      (error) => {
        console.warn('Firestore subscription error (falling back to initial 15 stores):', error);
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
