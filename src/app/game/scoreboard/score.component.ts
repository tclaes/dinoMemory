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
      <div *ngFor='let score of collection$ | async' class="scoreboard">
        <p>{{score.user}} - {{score.clicks}} - {{score.time}}</p>
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
      this.collection$ = this.scoreSrv.loadScores();
   }

   updateScores() {
     this.scoreSrv.updateScores('Tom', this.nrOfClicks, this.time);
   }

  ngOnInit() {
  }
}
