import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { NavigationComponent } from './navigation.component';
import { DeckService } from '../../shared/deck.service';
import { GameService } from '../../game/game.service';
import { SharedService } from '../../shared/shared.service';
import { AuthService } from '../../auth.service';
import { mockUser } from '../../../testing/firebase-mocks';
import { SpyObj, createSpyObj } from '../../../testing/spy';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let deckSrvSpy: SpyObj<DeckService>;
  let gameSrvSpy: SpyObj<GameService>;
  let authSrvSpy: SpyObj<AuthService>;
  let routerSpy: SpyObj<Router>;
  const decksFixture = { deck: [{ name: 'dinos' }, { name: 'frameworks' }] };

  beforeEach(fakeAsync(() => {
    deckSrvSpy = createSpyObj('DeckService', ['getData']);
    deckSrvSpy.getData.mockReturnValue(Promise.resolve(decksFixture));

    gameSrvSpy = createSpyObj('GameService', ['changeDeck', 'newGame']);
    authSrvSpy = createSpyObj('AuthService', ['logOut']);
    (authSrvSpy as any).User = of(mockUser);
    routerSpy = createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [NavigationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: BreakpointObserver, useValue: { observe: () => of({ matches: false }) } },
        { provide: DeckService, useValue: deckSrvSpy },
        { provide: GameService, useValue: gameSrvSpy },
        SharedService,
        { provide: AuthService, useValue: authSrvSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the deck list and the current user without throwing', () => {
    expect(deckSrvSpy.getData).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });

  it('newGame() changes the deck, starts a new game and navigates to /game', () => {
    const event = { currentTarget: { innerText: 'dinos' } };
    component.newGame(event);

    expect(gameSrvSpy.changeDeck).toHaveBeenCalledWith('dinos');
    expect(gameSrvSpy.newGame).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/game']);
  });

  it('logOut() logs out and navigates to /login', () => {
    component.logOut();

    expect(authSrvSpy.logOut).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
