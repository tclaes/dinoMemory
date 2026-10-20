import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { UserprofileComponent } from './userprofile.component';
import { AuthService } from '../auth.service';
import { mockUser } from '../../testing/firebase-mocks';

function configure(user$: any) {
  TestBed.configureTestingModule({
    imports: [UserprofileComponent],
    providers: [
      { provide: AuthService, useValue: { User: user$ } }
    ]
  });
  // Material card/grid/form-field are out of scope here; render them as unknown elements.
  TestBed.overrideComponent(UserprofileComponent, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } });
}

describe('UserprofileComponent', () => {
  let component: UserprofileComponent;
  let fixture: ComponentFixture<UserprofileComponent>;

  beforeEach(() => {
    configure(of(mockUser));

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

  it('does not throw and shows no user data before AuthService emits', () => {
    TestBed.resetTestingModule();
    configure(of());

    const pendingFixture = TestBed.createComponent(UserprofileComponent);

    expect(() => pendingFixture.detectChanges()).not.toThrow();
    expect(pendingFixture.componentInstance.user).toBeUndefined();
    expect(pendingFixture.nativeElement.textContent).toContain('Welkom');
    expect(pendingFixture.nativeElement.textContent).not.toContain('undefined');
  });
});
