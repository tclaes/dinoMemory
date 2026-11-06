import {Component, inject, OnInit} from '@angular/core';
import {GameService} from '../playfield/services/game.service';
import {Score, ScoreService} from './score.service';
import {Observable} from 'rxjs';
import {ClicksService} from '../game-status-bar/services/clicks.service';
import {GlobalService} from '../global/services/global.service';
import {TimerService} from '../game-status-bar/services/timer.service';
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
import {DurationPipe} from '../game-status-bar/format/duration.pipe';

@Component({
  selector: 'app-scoreboard',
  template: `
      <div class="score">
          <h3>Game Won !!!</h3>
<p>{{ nrOfClicks() }} tries</p>
          <p>{{ elapsedMs() | duration }}</p>

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
                      <td mat-cell *matCellDef="let score"> {{ score.durationMs | duration }}</td>
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
    DurationPipe,
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
  #clicksService = inject(ClicksService);
  #globalService = inject(GlobalService);
  nrOfClicks = this.#clicksService.countedClicks;
  #scoreService = inject(ScoreService);
  #timerService = inject(TimerService);
  elapsedMs = this.#timerService.elapsedMs;

  newGame() {
    this.#globalService.stopGame();
  }

  ngOnInit() {
    const deck = this.gameService.deck()?.name;
    const user = this.gameService.user();
    if (user && !this.gameService.scoreSaved()) {
      this.#scoreService.updateScores(user.displayName, this.nrOfClicks(), this.elapsedMs(), deck);
      this.gameService.markScoreSaved();
    }
    this.collection$ = this.#scoreService.loadScores(deck);
  }
}
