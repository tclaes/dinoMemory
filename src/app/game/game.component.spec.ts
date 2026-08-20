import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { GameComponent } from './game.component';
import { GameService } from './game.service';
import { SharedService } from '../shared/shared.service';
import { DeckService } from '../shared/deck.service';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameSrvSpy: jasmine.SpyObj<GameService>;

  beforeEach(() => {
    gameSrvSpy = jasmine.createSpyObj('GameService', ['newGame', 'flipCard', 'shuffle']);
    (gameSrvSpy as any).deck = { name: 'dinos', cards: ['a', 'b'] };
    (gameSrvSpy as any).gameWon = false;
    const deckSrvSpy = jasmine.createSpyObj('DeckService', ['getData']);

    TestBed.configureTestingModule({
      declarations: [GameComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: GameService, useValue: gameSrvSpy },
        SharedService,
        { provide: DeckService, useValue: deckSrvSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts a new game on init', () => {
    expect(gameSrvSpy.newGame).toHaveBeenCalled();
  });

  it('flipCard() delegates to GameService and bumps the shared click counter', () => {
    const startingClicks = component.clicked;
    const event = { currentTarget: {} };

    component.flipCard(event);

    expect(gameSrvSpy.flipCard).toHaveBeenCalledWith(event);
    expect(component.clicked).toBe(startingClicks + 1);
  });
});
