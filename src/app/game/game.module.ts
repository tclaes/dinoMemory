import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards/cards.component';
import { ClicksComponent } from './clicks/clicks.component';
import { ScoreComponent } from './score/score.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { TimerComponent } from './timer/timer.component';
import { SharedModule } from '../shared/shared.module';
import { UserprofileModule } from '../userprofile/userprofile.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UserprofileModule,
  ],
  declarations: [
    CardsComponent,
    ClicksComponent,
    ScoreComponent,
    ScoreboardComponent,
    TimerComponent,
  ],
  exports: [
    CardsComponent,
    ClicksComponent,
    ScoreComponent,
    ScoreboardComponent,
    TimerComponent,
    UserprofileModule
   ]
})
export class GameModule { }
