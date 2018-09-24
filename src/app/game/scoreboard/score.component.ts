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
      <button id="won" class="button" (click)="game.newGame($event.target)">New game?</button>
      <div  class="scoreboard">

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Clicks</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor='let score of collection$ | async'>
            <td>{{score.user}}</td>
            <td>{{score.clicks}}</td>
            <td>{{score.time}}</td>
          </tr>
        </tbody>
      </table>

      </div>
    </div>

  `,
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {

  @Input() nrOfClicks;
  @Input() time;

  collection$: Observable<Score[]>;

  constructor(public game: GameComponent, public gameSrv: GameService, private scoreSrv: ScoreService) {
      this.collection$ = this.scoreSrv.loadScores(gameSrv.standardDeck);
   }

   updateScores() {
     this.scoreSrv.updateScores('Tom', this.nrOfClicks, this.time, this.gameSrv.standardDeck);
   }

  ngOnInit() {
  }
}
