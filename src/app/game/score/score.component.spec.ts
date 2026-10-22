import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, signal} from '@angular/core';

import {ScoreComponent} from './score.component';
import {DeckService} from '../playfield/services/deck.service';
import {GameService} from '../playfield/services/game.service';
import {createSpyObj, SpyObj} from '../../../testing/spy';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;
  let gameSrvSpy: SpyObj<GameService>;
  const decksFixture = [{name: 'dinos'}, {name: 'frameworks'}];

  beforeEach(() => {
    gameSrvSpy = createSpyObj('GameService', ['restart']);

    TestBed.configureTestingModule({
      imports: [ScoreComponent],
      providers: [
        {provide: DeckService, useValue: {availableDecks: signal(decksFixture)}},
        {provide: GameService, useValue: gameSrvSpy}
      ]
    });
    // Clicks/timer children are covered by their own specs; render them as unknown elements.
    TestBed.overrideComponent(ScoreComponent, {set: {imports: [], schemas: [NO_ERRORS_SCHEMA]}});

    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('exposes the available deck list', () => {
    expect(component.decks$()).toEqual(decksFixture);
  });

  it('the New Game button restarts the game', () => {
    fixture.nativeElement.querySelector('.new-game-btn').click();
    expect(gameSrvSpy.restart).toHaveBeenCalled();
  });
});
