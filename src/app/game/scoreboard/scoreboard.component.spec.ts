import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ScoreboardComponent } from './scoreboard.component';
import { GameService } from '../game.service';
import { ScoreService } from './score.service';
import { SharedService } from '../../shared/shared.service';
import { TimerService } from '../timer/timer.service';
import { SpyObj, createSpyObj } from '../../../testing/spy';

describe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<ScoreboardComponent>;
  let gameSrvSpy: SpyObj<GameService>;
  let scoreSrvSpy: SpyObj<ScoreService>;

  beforeEach(() => {
    gameSrvSpy = createSpyObj('GameService', ['newGame']);
    scoreSrvSpy = createSpyObj('ScoreService', ['loadScores']);
    scoreSrvSpy.loadScores.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      imports: [ScoreboardComponent],
      providers: [
        { provide: GameService, useValue: gameSrvSpy },
        { provide: ScoreService, useValue: scoreSrvSpy },
        SharedService,
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

  it('ngOnInit() loads the scores for the current deck', () => {
    fixture.detectChanges();
    expect(scoreSrvSpy.loadScores).toHaveBeenCalledWith('dinos');
  });

  it('newGame() delegates to GameService', () => {
    fixture.detectChanges();
    component.newGame();
    expect(gameSrvSpy.newGame).toHaveBeenCalled();
  });
});
