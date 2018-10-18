import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../game.service';
import { ScoreService, Score } from './score.service';
import { Observable } from 'rxjs';
import { SharedService } from './../../shared/shared.service';
import { TimerService } from '../timer/timer.service';

@Component({
  selector: 'app-scoreboard',
  template: `
    <div class="score">
      <h3>Game Won !!!</h3>
      <p>{{ nrOfClicks }} clicks</p>
      <p>{{ stopwatch }}</p>

      <div class="scoreboard">
        <table mat-table [dataSource]="collection$" class="mat-elevation-z8">
          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef> User </th>
            <td mat-cell *matCellDef="let score"> {{score.user}}</td>
          </ng-container>
          <ng-container matColumnDef="clicks">
            <th mat-header-cell *matHeaderCellDef> Clicks </th>
            <td mat-cell *matCellDef="let score"> {{score.clicks}}</td>
          </ng-container>
          <ng-container matColumnDef="time">
            <th mat-header-cell *matHeaderCellDef> Time </th>
            <td mat-cell *matCellDef="let score"> {{score.time}} </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      <button id="won" class="button" (click)="newGame()" mat-stroked-button>New game?</button>
    </div>


  `,
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  nrOfClicks;
  stopwatch;
  standardDeck;

  collection$: Observable<Score[]>;
  displayedColumns: string[] = ['user', 'clicks', 'time'];

  constructor(
    public gameSrv: GameService,
    private scoreSrv: ScoreService,
    private sharedSrv: SharedService,
    private timerSrv: TimerService
  ) {
    this.sharedSrv.currentTimesClicked.subscribe(clicks => this.nrOfClicks = clicks);
    this.timerSrv.currentTime.subscribe(time => this.stopwatch = time);
    this.sharedSrv.standardDeck.subscribe(deck => this.standardDeck = deck);
  }

  newGame() {
    this.gameSrv.newGame();
  }

  ngOnInit() {
    this.collection$ = this.scoreSrv.loadScores(this.standardDeck.name);
  }
}
