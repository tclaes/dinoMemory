import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';

import {ScoreboardComponent} from './scoreboard.component';
import {GameService} from '../playfield/services/game.service';
import {ScoreService} from './score.service';
import {TimerService} from '../game-status-bar/services/timer.service';
import {createSpyObj, SpyObj} from '../../../testing/spy';
import {beforeEach, describe, it} from 'vitest';

describe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<ScoreboardComponent>;
  let gameSrvSpy: SpyObj<GameService>;
  let scoreSrvSpy: SpyObj<ScoreService>;

  beforeEach(() => {
    gameSrvSpy = createSpyObj('GameService', []);
    scoreSrvSpy = createSpyObj('ScoreService', ['loadScores']);
    scoreSrvSpy.loadScores.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      imports: [ScoreboardComponent],
      providers: [
        {provide: GameService, useValue: gameSrvSpy},
        {provide: ScoreService, useValue: scoreSrvSpy},
        TimerService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // Pending: the scoreboard's loadScores/newGame wiring is commented out in the component for now.
  it.todo('ngOnInit() loads the scores for the current deck');
  it.todo('newGame() delegates to GameService');
});
