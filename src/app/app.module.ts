import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameModule } from './game/game.module';
import { SharedModule } from './shared/shared.module';

import { environment } from '../environments/environment';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StorageServiceModule } from 'angular-webstorage-service';

import { GameComponent } from './game/game.component';
import { NavigationComponent } from './nav/navigation/navigation.component';

import { DisableClickDirective } from './shared/disable-click.directive';
import { GameWonDirective } from './shared/game-won.directive';
import { HoldableDirective } from './shared/holdable.directive';
import { StandardDeckDirective } from './shared/standard-deck.directive';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    BrowserAnimationsModule,
    BrowserModule,
    GameModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    StorageServiceModule,
    SharedModule
    ],
  declarations: [
    AppComponent,
    DisableClickDirective,
    GameComponent,
    GameWonDirective,
    HoldableDirective,
    NavigationComponent,
    StandardDeckDirective,
  ],
  providers: [ StandardDeckDirective ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
