import { Component, OnInit, Input } from '@angular/core';
import { GameComponent } from '../game.component';
import { GameService } from '../game.service';
import { ScoreService, Score } from './score.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-score',
  template: `
    <div class="score">
      <h3>Game Won !!!</h3>
      <p>{{gameSrv.nrOfClicks}} clicks</p>
      <p>{{gameSrv.timer}}</p>

      <div  class="scoreboard">
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
      <button id="won" class="button" (click)="game.newGame($event.target)" mat-stroked-button>New game?</button>
    </div>


  `,
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  @Input()
  nrOfClicks;
  @Input()
  time;

  collection$: Observable<Score[]>;
  displayedColumns: string[] = ['user', 'clicks', 'time'];

  constructor(
    public game: GameComponent,
    public gameSrv: GameService,
    private scoreSrv: ScoreService
  ) {}

  ngOnInit() {
    this.collection$ = this.scoreSrv.loadScores(this.gameSrv.standardDeck);
  }
}
