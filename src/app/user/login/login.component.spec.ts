import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {provideRouter, Router} from '@angular/router';
import {vi} from 'vitest';

import {LoginComponent} from './login.component';
import {AuthService} from '../../core/auth/services/auth.service';
import {createSpyObj, SpyObj} from '../../../testing/spy';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: SpyObj<AuthService>;
  let navigateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    authSpy = createSpyObj('AuthService', ['doEmailLogin', 'doGoogleLogin']);

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authSpy },
        // A real router is needed for the template's routerLink; navigation itself is spied on.
        provideRouter([])
      ]
    });
    navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is invalid when the form is empty', () => {
    expect(component.signInForm.valid).toBe(false);
    expect(component.f.email.errors.required).toBeTruthy();
    expect(component.f.password.errors.required).toBeTruthy();
  });

  it('flags a malformed email address', () => {
    component.signInForm.controls.email.setValue('not-an-email');
    fixture.detectChanges(false);
    expect(component.f.email.errors.email).toBeTruthy();
  });

  it('is valid with a proper email and a password of at least 6 characters', () => {
    component.signInForm.controls.email.setValue('player@example.com');
    component.signInForm.controls.password.setValue('secret1');
    fixture.detectChanges(false);
    expect(component.signInForm.valid).toBe(true);
  });

  it('signInWithEmail() delegates to AuthService with the raw form values', () => {
    component.signInForm.controls.email.setValue('player@example.com');
    component.signInForm.controls.password.setValue('secret1');
    fixture.detectChanges(false);

    authSpy.doEmailLogin.mockReturnValue(Promise.resolve({} as any));
    component.signInWithEmail();

    expect(authSpy.doEmailLogin).toHaveBeenCalledWith({ email: 'player@example.com', password: 'secret1' });
  });

  it('signInWithEmail() only navigates to the profile page once login resolves', async () => {
    let resolveLogin: (value: any) => void;
    authSpy.doEmailLogin.mockReturnValue(new Promise(resolve => resolveLogin = resolve));

    const pending = component.signInWithEmail();
    expect(navigateSpy).not.toHaveBeenCalled();

    resolveLogin({} as any);
    await pending;

    expect(navigateSpy).toHaveBeenCalledWith(['/userprofile']);
  });

  it('signInWithEmail() does not navigate when login fails', async () => {
    authSpy.doEmailLogin.mockReturnValue(Promise.reject(new Error('bad credentials')));

    await component.signInWithEmail();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('loginWithGoogle() delegates to AuthService and does not itself navigate (AuthService navigates home on success)', async () => {
    authSpy.doGoogleLogin.mockReturnValue(Promise.resolve({} as any));

    await component.loginWithGoogle({} as any);

    expect(authSpy.doGoogleLogin).toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('loginWithGoogle() does not navigate when the popup fails or is dismissed', async () => {
    authSpy.doGoogleLogin.mockReturnValue(Promise.reject(new Error('popup closed')));

    await component.loginWithGoogle({} as any);

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
