import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { CardsComponent } from './cards/cards.component';
import { GameComponent } from './game/game.component';
import { ClicksComponent } from './nav/clicks/clicks.component';
import { StandardDeckDirective } from './shared/standard-deck.directive';
import { GameWonDirective } from './shared/game-won.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from '../environments/environment';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { DisableClickDirective } from './shared/disable-click.directive';
import { TimerComponent } from './nav/timer/timer.component';
import { ScoreComponent } from './game/scoreboard/score.component';
import { PlayerComponent } from './game/player/player.component';
import { StorageServiceModule } from 'angular-webstorage-service';
import { HoldableDirective } from './shared/holdable.directive';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    StorageServiceModule
  ],
  declarations: [AppComponent, NavComponent, CardsComponent,
    GameComponent, ClicksComponent, StandardDeckDirective, GameWonDirective,
    DisableClickDirective, TimerComponent, ScoreComponent, PlayerComponent, HoldableDirective],
  providers: [ StandardDeckDirective ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
