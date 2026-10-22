import {Component, inject, OnInit} from '@angular/core';
import {GameService} from '../playfield/services/game.service';
import {Score, ScoreService} from './score.service';
import {Observable} from 'rxjs';
import {TimerService} from '../timer/timer.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-scoreboard',
  template: `
      <div class="score">
          <h3>Game Won !!!</h3>
          <p>{{ nrOfClicks() }} clicks</p>
          <p>{{ stopwatch() }}</p>

          <div class="scoreboard">
              <table mat-table [dataSource]="collection$" class="mat-elevation-z8">
                  <ng-container matColumnDef="user">
                      <th mat-header-cell *matHeaderCellDef> User</th>
                      <td mat-cell *matCellDef="let score"> {{ score.user }}</td>
                  </ng-container>
                  <ng-container matColumnDef="clicks">
                      <th mat-header-cell *matHeaderCellDef> Clicks</th>
                      <td mat-cell *matCellDef="let score"> {{ score.clicks }}</td>
                  </ng-container>
                  <ng-container matColumnDef="time">
                      <th mat-header-cell *matHeaderCellDef> Time</th>
                      <td mat-cell *matCellDef="let score"> {{ score.time }}</td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
          </div>
          <button id="won" class="button" (click)="newGame()" mat-stroked-button>New game?</button>
      </div>
  `,
  styleUrls: ['./scoreboard.component.scss'],
  imports: [
    MatRow,
    MatHeaderRow,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatRowDef,
    MatButton,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatTable
  ]
})
export class ScoreboardComponent implements OnInit {
  gameService = inject(GameService);
  collection$: Observable<Score[]>;
  displayedColumns: string[] = ['user', 'clicks', 'time'];
  nrOfClicks = this.gameService.clicked;
  #scoreService = inject(ScoreService);
  #timerService = inject(TimerService);
  stopwatch = this.#timerService.currentTime;

  newGame() {
    this.gameService.newGame();
  }

  ngOnInit() {
    console.log('Scores need to be fixed');
    // this.collection$ = this.#scoreService.loadScores(this.gameService.deck);
  }
}
