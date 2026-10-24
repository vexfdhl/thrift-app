import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  getDocFromServer
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ThriftStoreItem, ReviewItem, DUVAL_THRIFT_STORES } from '../data/thriftStores';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const BOOTSTRAP_ADMIN_EMAIL = 'vexijbg@gmail.com';

// 8 Pillars: Operation Types & Standard Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Skill constraint: Validate Connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: client appears offline, using cached or fallback data.');
    }
  }
}
testConnection();

// Check if current user is an authorized admin
export async function isCurrentUserAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.email) return false;
  if (user.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) return true;

  try {
    const adminDocRef = doc(db, 'admins', user.uid);
    const snap = await getDoc(adminDocRef);
    return snap.exists();
  } catch {
    return false;
  }
}

// Seed initial thrift stores into Firestore if collection is empty
let isSeeding = false;
export async function seedInitialStoresIfEmpty(): Promise<void> {
  if (isSeeding) return;
  isSeeding = true;
  try {
    const storesColl = collection(db, 'stores');
    const existingSnap = await getDocs(storesColl);

    if (existingSnap.empty) {
      console.log('Seeding initial Duval thrift stores into Firestore...');
      for (const store of DUVAL_THRIFT_STORES) {
        const storeRef = doc(db, 'stores', store.id);
        const storeData: ThriftStoreItem & { published: boolean; updatedAt: string; createdAt: string } = {
          ...store,
          published: true,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        await setDoc(storeRef, storeData);

        // Also seed initial reviews into top-level /reviews collection with status = 'approved'
        if (store.reviews && store.reviews.length > 0) {
          for (const rev of store.reviews) {
            const revRef = doc(db, 'reviews', rev.id);
            await setDoc(revRef, {
              ...rev,
              storeId: store.id,
              status: 'approved',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      }
      console.log('Initial Duval stores and community reviews successfully seeded into Firestore.');
    }
  } catch (err) {
    console.warn('Firestore initial seeding skipped or deferred:', err);
  } finally {
    isSeeding = false;
  }
}

// Real-time listener for Stores
export function subscribeToStores(
  onUpdate: (stores: ThriftStoreItem[]) => void,
  onError?: (err: Error) => void
) {
  const storesPath = 'stores';
  const q = collection(db, storesPath);

  return onSnapshot(
    q,
    (snapshot) => {
      const storesList: ThriftStoreItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ThriftStoreItem & { published?: boolean };
        // Default published to true if missing
        const isPublished = data.published !== false;
        storesList.push({
          ...data,
          published: isPublished,
        } as ThriftStoreItem);
      });
      onUpdate(storesList);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.GET, storesPath);
      }
    }
  );
}

// Real-time listener for Reviews
export interface FirestoreReviewItem extends ReviewItem {
  storeId: string;
  status: 'approved' | 'pending' | 'hidden';
  createdAt?: string;
  updatedAt?: string;
}

export function subscribeToReviews(
  onUpdate: (reviews: FirestoreReviewItem[]) => void,
  onError?: (err: Error) => void
) {
  const reviewsPath = 'reviews';
  const q = collection(db, reviewsPath);

  return onSnapshot(
    q,
    (snapshot) => {
      const reviewsList: FirestoreReviewItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FirestoreReviewItem;
        reviewsList.push({
          ...data,
          id: docSnap.id,
          status: data.status || 'approved',
        });
      });
      onUpdate(reviewsList);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.GET, reviewsPath);
      }
    }
  );
}

// Admin store management functions
export async function createOrUpdateStore(store: ThriftStoreItem & { published?: boolean }): Promise<void> {
  const path = `stores/${store.id}`;
  try {
    const storeRef = doc(db, 'stores', store.id);
    const payload = {
      ...store,
      published: store.published !== undefined ? store.published : true,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(storeRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStore(storeId: string): Promise<void> {
  const path = `stores/${storeId}`;
  try {
    const storeRef = doc(db, 'stores', storeId);
    await deleteDoc(storeRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Review moderation functions
export async function createReview(
  review: Omit<FirestoreReviewItem, 'status'> & { status?: 'approved' | 'pending' | 'hidden' }
): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    const reviewRef = doc(db, 'reviews', review.id);
    const payload: FirestoreReviewItem = {
      ...review,
      status: review.status || 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(reviewRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateReviewStatus(
  reviewId: string,
  newStatus: 'approved' | 'pending' | 'hidden'
): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Helpful count upvote
export async function incrementHelpfulCount(reviewId: string, currentCount: number): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      helpfulCount: currentCount + 1,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Admin Auth actions
export async function loginWithGoogle(): Promise<User> {
  const cred = await signInWithPopup(auth, googleProvider);
  return cred.user;
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}
