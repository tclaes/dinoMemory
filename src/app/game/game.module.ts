import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards/cards.component';
import { ClicksComponent } from './clicks/clicks.component';
import { PlayerComponent } from './player/player.component';
import { ScoreComponent } from './score/score.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { TimerComponent } from './timer/timer.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    CardsComponent,
    ClicksComponent,
    ScoreComponent,
    ScoreboardComponent,
    TimerComponent,
    PlayerComponent
  ],
  exports: [
    CardsComponent,
    ClicksComponent,
    ScoreComponent,
    ScoreboardComponent,
    TimerComponent,
    PlayerComponent,
   ]
})
export class GameModule { }
