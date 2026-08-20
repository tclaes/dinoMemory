import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from '../../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['doEmailLogin', 'doGoogleLogin']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
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
    expect(component.f.email.errors.email).toBeTruthy();
  });

  it('is valid with a proper email and a password of at least 6 characters', () => {
    component.signInForm.controls.email.setValue('player@example.com');
    component.signInForm.controls.password.setValue('secret1');
    expect(component.signInForm.valid).toBe(true);
  });

  it('signInWithEmail() delegates to AuthService with the raw form values', () => {
    component.signInForm.controls.email.setValue('player@example.com');
    component.signInForm.controls.password.setValue('secret1');

    component.signInWithEmail();

    expect(authSpy.doEmailLogin).toHaveBeenCalledWith({ email: 'player@example.com', password: 'secret1' });
  });

  // KNOWN BUG (deliberately not fixed here — pinned down as an upgrade baseline):
  // both sign-in methods navigate to /userprofile immediately after calling into
  // AuthService, without waiting for the login to resolve or checking whether it succeeded.
  it('KNOWN BUG: signInWithEmail() navigates to the profile page regardless of the login outcome', () => {
    component.signInWithEmail();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/userprofile']);
  });

  it('KNOWN BUG: loginWithGoogle() also navigates immediately, regardless of the login outcome', () => {
    component.loginWithGoogle({} as any);

    expect(authSpy.doGoogleLogin).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/userprofile']);
  });
});
