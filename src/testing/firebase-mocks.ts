import { BehaviorSubject, of } from 'rxjs';
import { createSpyObj } from './spy';

/**
 * Reusable Firebase test doubles. Never import provideFirebaseApp/initializeApp in specs —
 * that calls the real project config from src/environments/environment.ts and will try to
 * talk to the live project. AUTH_OPS/FIRESTORE_OPS wrap the modular SDK's free functions so
 * specs can spy on them via DI instead of spying on ES module exports directly.
 */

export const mockUser: any = {
  uid: 'test-uid',
  displayName: 'Test User',
  email: 'test@example.com'
};

export function createMockAuthOps(initialUser: any = mockUser) {
  const authStateSubject = new BehaviorSubject<any>(initialUser);
  const ops = createSpyObj('AuthOps', [
    'authState', 'signInWithPopup', 'signInWithEmailAndPassword',
    'createUserWithEmailAndPassword', 'updateCurrentUser', 'signOut', 'updateProfile'
  ]);
  ops.authState.mockReturnValue(authStateSubject.asObservable());
  return { ops, authStateSubject };
}

export function createMockFirestoreOps(scores: any[] = []) {
  const ops = createSpyObj('FirestoreOps', [
    'collection', 'query', 'where', 'orderBy', 'startAt', 'endAt', 'limit', 'collectionData', 'addDoc'
  ]);
  ops.collectionData.mockReturnValue(of(scores));
  return ops;
}
