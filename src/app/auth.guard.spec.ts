import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { mockUser } from '../testing/firebase-mocks';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authStateSubject: BehaviorSubject<any>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authStateSubject = new BehaviorSubject<any>(mockUser);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: { authState: authStateSubject } },
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.get(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('allows navigation and does not redirect when a user is authenticated', () => {
    const result = guard.canActivate(null, null);

    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  // KNOWN BUG (deliberately not fixed here — pinned down as an upgrade baseline):
  // canActivate() always returns true synchronously. It triggers router.navigate(['/login'])
  // as a side effect when authState is null, but that navigation does not actually block the
  // route since the guard's return value never reflects it.
  it('KNOWN BUG: still returns true (does not block) when no user is authenticated', () => {
    authStateSubject.next(null);

    const result = guard.canActivate(null, null);

    expect(result).toBe(true);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
