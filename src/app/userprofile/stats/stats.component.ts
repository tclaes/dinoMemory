import { Component, OnInit } from '@angular/core';
import { ScoreService } from '../../game/scoreboard/score.service';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  user: firebase.User;
  collection$: Observable<any>;
  displayedColumns: string[] = ['user', 'clicks', 'time'];

  constructor(
    private scoreSrv: ScoreService,
    private authSrv: AuthService) {
      this.authSrv.User.subscribe(user => {
        this.user = user;
        this.collection$ = this.scoreSrv.loadUserStats(user.uid);
      });
     }

  ngOnInit() {
    this.collection$ = this.scoreSrv.loadUserStats("umRYyQ0rhbYNZ4LWTOORWfI9NT62");
  }

}
