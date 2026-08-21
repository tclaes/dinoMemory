import { BehaviorSubject, of } from 'rxjs';

/**
 * Reusable Firebase test doubles. Never import AngularFireModule / AngularFirestoreModule /
 * AngularFireAuthModule in specs — they call firebase.initializeApp() with the real project
 * config from src/environments/environment.ts and will try to talk to the live project.
 */

export const mockUser: any = {
  uid: 'test-uid',
  displayName: 'Test User',
  email: 'test@example.com'
};

export class MockAngularFireAuth {
  authStateSubject = new BehaviorSubject<any>(mockUser);
  authState = this.authStateSubject.asObservable();
  signInWithPopup = jasmine.createSpy('signInWithPopup');
  signInWithEmailAndPassword = jasmine.createSpy('signInWithEmailAndPassword');
  createUserWithEmailAndPassword = jasmine.createSpy('createUserWithEmailAndPassword');
  signOut = jasmine.createSpy('signOut');
  updateCurrentUser = jasmine.createSpy('updateCurrentUser');
}

export function createMockAngularFireAuth(): MockAngularFireAuth {
  return new MockAngularFireAuth();
}

export function createMockAngularFirestore(scores: any[] = []) {
  const collectionSpy = jasmine.createSpyObj('AngularFirestoreCollection', ['valueChanges', 'add']);
  collectionSpy.valueChanges.and.returnValue(of(scores));

  const afsSpy = jasmine.createSpyObj('AngularFirestore', ['collection']);
  afsSpy.collection.and.returnValue(collectionSpy);

  return { afsSpy, collectionSpy };
}
