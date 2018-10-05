import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards/cards.component';
import { ClicksComponent } from './clicks/clicks.component';
import { PlayerComponent } from './player/player.component';
import { ScoreComponent } from './score/score.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { TimerComponent } from './timer/timer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CardsComponent,
    ClicksComponent,
    ScoreComponent,
    TimerComponent
  ],
  exports: [
    CardsComponent,
    ClicksComponent,
    ScoreComponent,
    TimerComponent
  ]
})
export class GameModule { }
