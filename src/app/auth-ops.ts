import { InjectionToken } from '@angular/core';
import {
  authState,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateCurrentUser,
  updateProfile,
  signOut
} from '@angular/fire/auth';

/**
 * The modular Firebase SDK exposes auth operations as free functions (e.g.
 * `signInWithPopup(auth, provider)`) rather than methods on an injected object.
 * Jasmine can't reliably spyOn() named ES module exports under this project's
 * webpack/Karma toolchain, so these are wrapped behind an injectable token instead —
 * AuthService calls `this.ops.signInWithPopup(...)`, and specs swap in a spy object.
 */
export interface AuthOps {
  authState: typeof authState;
  signInWithPopup: typeof signInWithPopup;
  signInWithEmailAndPassword: typeof signInWithEmailAndPassword;
  createUserWithEmailAndPassword: typeof createUserWithEmailAndPassword;
  updateCurrentUser: typeof updateCurrentUser;
  updateProfile: typeof updateProfile;
  signOut: typeof signOut;
}

export const AUTH_OPS = new InjectionToken<AuthOps>('AUTH_OPS', {
  providedIn: 'root',
  factory: () => ({
    authState,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateCurrentUser,
    updateProfile,
    signOut
  })
});
