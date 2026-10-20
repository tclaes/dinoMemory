import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';

import {LoginComponent} from './login.component';
import {AuthService} from '../../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['doEmailLogin', 'doGoogleLogin']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

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

    authSpy.doEmailLogin.and.returnValue(Promise.resolve({} as any));
    component.signInWithEmail();

    expect(authSpy.doEmailLogin).toHaveBeenCalledWith({ email: 'player@example.com', password: 'secret1' });
  });

  it('signInWithEmail() only navigates to the profile page once login resolves', async () => {
    let resolveLogin: (value: any) => void;
    authSpy.doEmailLogin.and.returnValue(new Promise(resolve => resolveLogin = resolve));

    const pending = component.signInWithEmail();
    expect(routerSpy.navigate).not.toHaveBeenCalled();

    resolveLogin({} as any);
    await pending;

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user']);
  });

  it('signInWithEmail() does not navigate when login fails', async () => {
    authSpy.doEmailLogin.and.returnValue(Promise.reject(new Error('bad credentials')));

    await component.signInWithEmail();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('loginWithGoogle() delegates to AuthService and does not itself navigate (AuthService navigates home on success)', async () => {
    authSpy.doGoogleLogin.and.returnValue(Promise.resolve({} as any));

    await component.loginWithGoogle({} as any);

    expect(authSpy.doGoogleLogin).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('loginWithGoogle() does not navigate when the popup fails or is dismissed', async () => {
    authSpy.doGoogleLogin.and.returnValue(Promise.reject(new Error('popup closed')));

    await component.loginWithGoogle({} as any);

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
