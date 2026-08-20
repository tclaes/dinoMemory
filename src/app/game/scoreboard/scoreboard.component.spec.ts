import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';

import { ScoreboardComponent } from './scoreboard.component';
import { GameService } from '../game.service';
import { ScoreService } from './score.service';
import { SharedService } from '../../shared/shared.service';
import { TimerService } from '../timer/timer.service';

describe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<ScoreboardComponent>;
  let gameSrvSpy: jasmine.SpyObj<GameService>;
  let scoreSrvSpy: jasmine.SpyObj<ScoreService>;

  beforeEach(() => {
    gameSrvSpy = jasmine.createSpyObj('GameService', ['newGame']);
    scoreSrvSpy = jasmine.createSpyObj('ScoreService', ['loadScores']);
    scoreSrvSpy.loadScores.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [ScoreboardComponent],
      imports: [MatTableModule],
      schemas: [NO_ERRORS_SCHEMA],
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
