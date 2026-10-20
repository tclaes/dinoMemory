import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, signal} from '@angular/core';

import {GameComponent} from './game.component';
import {GameService} from '../services/game.service';
import {SharedService} from '../../../shared/shared.service';
import {DeckService} from '../../../shared/deck.service';
import {createSpyObj, SpyObj} from '../../../../testing/spy';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let gameSrvSpy: SpyObj<GameService>;

  beforeEach(() => {
    gameSrvSpy = createSpyObj('GameService', ['newGame', 'flipCard', 'shuffle']);
    (gameSrvSpy as any).gameWon = false;
    (gameSrvSpy as any).gameGeneration = 0;
    const deckSrvFake = { selectedDeck: signal({ name: 'dinos', imgURL: 'dinos', cards: ['a', 'b'] }) };

    TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        { provide: GameService, useValue: gameSrvSpy },
        SharedService,
        { provide: DeckService, useValue: deckSrvFake }
      ]
    });
    // Child components are out of scope here; render them as unknown elements.
    TestBed.overrideComponent(GameComponent, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } });

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

  it('renders two cards per card in the selected deck', () => {
    expect(fixture.nativeElement.querySelectorAll('app-card').length).toBe(4);
  });

  it('flipCard() delegates to GameService and bumps the shared click counter', () => {
    const startingClicks = component.clicked();
    const event = { currentTarget: {} };

    component.flipCard(event);

    expect(gameSrvSpy.flipCard).toHaveBeenCalledWith(event);
    expect(component.clicked()).toBe(startingClicks + 1);
  });
});
