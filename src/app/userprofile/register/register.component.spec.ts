import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('AuthService', ['tryRegister']);

    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('is invalid when the form is empty', () => {
    expect(component.registerForm.valid).toBe(false);
    expect(component.f.name.errors.required).toBeTruthy();
    expect(component.f.email.errors.required).toBeTruthy();
    expect(component.f.password.errors.required).toBeTruthy();
  });

  it('flags a malformed email address and a too-short password', () => {
    component.registerForm.controls.email.setValue('not-an-email');
    component.registerForm.controls.password.setValue('abc');

    expect(component.f.email.errors.email).toBeTruthy();
    expect(component.f.password.errors.minlength).toBeTruthy();
  });

  it('is valid with a name, a proper email and a password of at least 6 characters', () => {
    component.registerForm.controls.name.setValue('Player One');
    component.registerForm.controls.email.setValue('player@example.com');
    component.registerForm.controls.password.setValue('secret1');

    expect(component.registerForm.valid).toBe(true);
  });

  it('register() delegates to AuthService.tryRegister with the raw form values', () => {
    component.registerForm.controls.name.setValue('Player One');
    component.registerForm.controls.email.setValue('player@example.com');
    component.registerForm.controls.password.setValue('secret1');

    component.register();

    expect(authSpy.tryRegister).toHaveBeenCalledWith({
      name: 'Player One',
      email: 'player@example.com',
      password: 'secret1'
    });
  });
});
