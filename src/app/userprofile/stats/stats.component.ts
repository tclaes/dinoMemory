import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../../game/scoreboard/score.service';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent {

  collection$: Observable<any>;
  displayedColumns: string[] = ['user', 'clicks', 'time', 'date'];

  constructor(
    private scoreSrv: ScoreService,
    private authSrv: AuthService) {
      this.authSrv.User.subscribe(user => {
        this.collection$ = this.scoreSrv.loadUserStats(user.uid);
      });
    }
}
