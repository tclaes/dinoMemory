import { InjectionToken } from '@angular/core';
import {
  user,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut
} from '@angular/fire/auth';

/**
 * The modular Firebase SDK exposes auth operations as free functions (e.g.
 * `signInWithPopup(auth, provider)`) rather than methods on an injected object.
 * Named ES module exports can't be reliably spied on in bundled ESM test builds,
 * so these are wrapped behind an injectable token instead —
 * AuthService calls `this.ops.signInWithPopup(...)`, and specs swap in a spy object.
 */
export interface AuthOps {
  user: typeof user;
  signInWithPopup: typeof signInWithPopup;
  signInWithEmailAndPassword: typeof signInWithEmailAndPassword;
  createUserWithEmailAndPassword: typeof createUserWithEmailAndPassword;
  updateCurrentUser: typeof updateCurrentUser;
  updateProfile: typeof updateProfile;
  updatePassword: typeof updatePassword;
  reauthenticateWithCredential: typeof reauthenticateWithCredential;
  emailCredential: typeof EmailAuthProvider.credential;
  signOut: typeof signOut;
}

export const AUTH_OPS = new InjectionToken<AuthOps>('AUTH_OPS', {
  providedIn: 'root',
  factory: () => ({
    user,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateCurrentUser,
    updateProfile,
    updatePassword,
    reauthenticateWithCredential,
    emailCredential: EmailAuthProvider.credential,
    signOut
  })
});
