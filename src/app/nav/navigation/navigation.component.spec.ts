import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, signal} from '@angular/core';
import {AsyncPipe, NgClass} from '@angular/common';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {of} from 'rxjs';

import {NavigationComponent} from './navigation.component';
import {DeckService} from '../../game/playfield/services/deck.service';
import {GameService} from '../../game/playfield/services/game.service';
import {SharedService} from '../../game/playfield/services/shared.service';
import {AuthService} from '../../core/auth/services/auth.service';
import {mockUser} from '../../../testing/firebase-mocks';
import {createSpyObj, SpyObj} from '../../../testing/spy';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let gameSrvSpy: SpyObj<GameService>;
  let authSrvSpy: SpyObj<AuthService>;
  let routerSpy: SpyObj<Router>;
  const decksFixture = [{name: 'dinos'}, {name: 'frameworks'}];

  beforeEach(() => {
    const deckSrvFake = {
      availableDecks: signal(decksFixture),
      selectedDeck: signal(decksFixture[0])
    };

    gameSrvSpy = createSpyObj('GameService', ['changeDeck', 'newGame']);
    authSrvSpy = createSpyObj('AuthService', ['logOut']);
    (authSrvSpy as any).User = of(mockUser);
    routerSpy = createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        {provide: BreakpointObserver, useValue: {observe: () => of({matches: false})}},
        {provide: DeckService, useValue: deckSrvFake},
        {provide: GameService, useValue: gameSrvSpy},
        SharedService,
        {provide: AuthService, useValue: authSrvSpy},
        {provide: Router, useValue: routerSpy}
      ]
    });
    // Material sidenav and routerLink are out of scope here; render them as unknown elements/attributes.
    TestBed.overrideComponent(NavigationComponent, {
      set: {imports: [NgClass, AsyncPipe], schemas: [NO_ERRORS_SCHEMA]}
    });

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the deck list and the current user', () => {
    expect(component.decks$()).toEqual(decksFixture);
    expect(component.user()).toEqual(mockUser);
  });

  it('newGame() starts a new game with the clicked deck and navigates to it', () => {
    const event = {currentTarget: {innerText: 'Dinos'}};
    component.newGame(event);

    expect(gameSrvSpy.newGame).toHaveBeenCalledWith('dinos');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['game', 'dinos']);
  });

  it('logOut() logs out and navigates to /login', () => {
    component.logOut();

    expect(authSrvSpy.logOut).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
