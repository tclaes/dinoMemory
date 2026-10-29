import { BehaviorSubject, of } from "rxjs";
import { createSpyObj } from "./spy";

/**
 * Reusable Firebase test doubles. Never import provideFirebaseApp/initializeApp in specs —
 * that calls the real project config from src/environments/environment.ts and will try to
 * talk to the live project. AUTH_OPS/FIRESTORE_OPS wrap the modular SDK's free functions so
 * specs can spy on them via DI instead of spying on ES module exports directly.
 */

export const mockUser: any = {
  uid: "test-uid",
  displayName: "Test User",
  email: "test@example.com",
};

export const mockSignedInUser: any = {
  uid: "signed-in-uid",
  displayName: "Signed In User",
  email: "signed-in@example.com",
};

export function createMockAuthOps(initialUser: any = mockUser) {
  const userSubject = new BehaviorSubject<any>(initialUser);
  const ops = createSpyObj("AuthOps", [
    "user",
    "signInWithPopup",
    "signInWithEmailAndPassword",
    "createUserWithEmailAndPassword",
    "updateCurrentUser",
    "signOut",
    "updateProfile",
  ]);
  ops.user.mockReturnValue(userSubject.asObservable());
  // Like Firebase: notify user() subscribers of the signed-in user, then resolve with a UserCredential.
  ops.signInWithEmailAndPassword.mockImplementation(
    async (_auth: unknown, email: string) => {
      const user = { ...mockSignedInUser, email };
      userSubject.next(user);
      return { user, providerId: null, operationType: "signIn" };
    },
  );
  return { ops, userSubject };
}

export function createMockFirestoreOps(scores: any[] = []) {
  const ops = createSpyObj("FirestoreOps", [
    "collection",
    "query",
    "where",
    "orderBy",
    "startAt",
    "endAt",
    "limit",
    "collectionData",
    "addDoc",
  ]);
  ops.collectionData.mockReturnValue(of(scores));
  return ops;
}
