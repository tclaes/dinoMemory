import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { createMockAngularFireAuth, MockAngularFireAuth, mockUser } from '../testing/firebase-mocks';

describe('AuthService', () => {
  let service: AuthService;
  let mockAfAuth: MockAngularFireAuth;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAfAuth = createMockAngularFireAuth();
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: mockAfAuth },
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('picks up the current auth state on construction', () => {
    expect(service.user).toEqual(mockUser);
  });

  it('doGoogleLogin() sets the user from the popup result and navigates home', fakeAsync(() => {
    const popupResult = { user: { ...mockUser, uid: 'google-uid' } };
    mockAfAuth.auth.signInWithPopup.and.returnValue(Promise.resolve(popupResult));

    service.doGoogleLogin();
    tick();

    expect(service.user).toEqual(popupResult.user as any);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('doEmailLogin() sets the display name and updates the current user', fakeAsync(() => {
    const player = { name: 'Player One', email: 'player@example.com' };
    const signInResult = { user: { ...mockUser, uid: 'email-uid' } };
    mockAfAuth.auth.signInWithEmailAndPassword.and.returnValue(Promise.resolve(signInResult));

    service.doEmailLogin(player);
    tick();

    expect(mockAfAuth.auth.signInWithEmailAndPassword).toHaveBeenCalledWith(player.name, player.email);
    expect(mockAfAuth.auth.updateCurrentUser).toHaveBeenCalled();
  }));

  it('tryRegister() creates the account and sets the profile display name', fakeAsync(() => {
    const newUser = { name: 'New Player', email: 'new@example.com', password: 'secret1' };
    const updateProfileSpy = jasmine.createSpy('updateProfile');
    const userCredential = { user: { updateProfile: updateProfileSpy } };
    mockAfAuth.auth.createUserWithEmailAndPassword.and.returnValue(Promise.resolve(userCredential));

    service.tryRegister(newUser as any);
    tick();

    expect(mockAfAuth.auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(newUser.email, newUser.password);
    expect(updateProfileSpy).toHaveBeenCalledWith({ displayName: newUser.name, photoURL: '' });
  }));

  it('logOut() signs out and navigates home', fakeAsync(() => {
    mockAfAuth.auth.signOut.and.returnValue(Promise.resolve());

    service.logOut();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));
});
