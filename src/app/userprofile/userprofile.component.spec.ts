import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { UserprofileComponent } from './userprofile.component';
import { AuthService } from '../auth.service';
import { mockUser } from '../../testing/firebase-mocks';

describe('UserprofileComponent', () => {
  let component: UserprofileComponent;
  let fixture: ComponentFixture<UserprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserprofileComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: { User: of(mockUser) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('picks up the current user from AuthService', () => {
    expect(component.user).toEqual(mockUser);
  });
});
