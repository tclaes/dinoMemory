import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { AUTH_OPS } from './auth-ops';
import { createMockAuthOps, mockUser } from '../testing/firebase-mocks';
import { SpyObj, createSpyObj } from '../testing/spy';

describe('AuthService', () => {
  let service: AuthService;
  let authOps: SpyObj<any>;
  let routerSpy: SpyObj<Router>;
  const fakeAuth = {};

  beforeEach(() => {
    const mocks = createMockAuthOps();
    authOps = mocks.ops;
    routerSpy = createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: fakeAuth },
        { provide: AUTH_OPS, useValue: authOps },
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('picks up the current auth state on construction', () => {
    expect(service.user).toEqual(mockUser);
  });

  it('doGoogleLogin() sets the user from the popup result and navigates home', fakeAsync(() => {
    const popupResult = { user: { ...mockUser, uid: 'google-uid' } };
    authOps.signInWithPopup.mockReturnValue(Promise.resolve(popupResult));

    service.doGoogleLogin();
    tick();

    expect(service.user).toEqual(popupResult.user as any);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('doEmailLogin() sets the display name and updates the current user', fakeAsync(() => {
    const player = { name: 'Player One', email: 'player@example.com' };
    const signInResult = { user: { ...mockUser, uid: 'email-uid' } };
    authOps.signInWithEmailAndPassword.mockReturnValue(Promise.resolve(signInResult));

    service.doEmailLogin(player);
    tick();

    expect(authOps.signInWithEmailAndPassword).toHaveBeenCalledWith(fakeAuth, player.name, player.email);
    expect(authOps.updateCurrentUser).toHaveBeenCalled();
  }));

  it('tryRegister() creates the account and sets the profile display name', fakeAsync(() => {
    const newUser = { name: 'New Player', email: 'new@example.com', password: 'secret1' };
    const userCredential = { user: { displayName: newUser.name } };
    authOps.createUserWithEmailAndPassword.mockReturnValue(Promise.resolve(userCredential));

    service.tryRegister(newUser as any);
    tick();

    expect(authOps.createUserWithEmailAndPassword).toHaveBeenCalledWith(fakeAuth, newUser.email, newUser.password);
    expect(authOps.updateProfile).toHaveBeenCalledWith(userCredential.user, { displayName: newUser.name, photoURL: '' });
  }));

  it('logOut() signs out and navigates home', fakeAsync(() => {
    authOps.signOut.mockReturnValue(Promise.resolve());

    service.logOut();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));
});
