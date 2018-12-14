import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameModule } from './game/game.module';
import { SharedModule } from './shared/shared.module';

import { environment } from '../environments/environment';
export const firebaseConfig = environment.firebaseConfig;
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StorageServiceModule } from 'angular-webstorage-service';

import { GameComponent } from './game/game.component';
import { NavigationComponent } from './nav/navigation/navigation.component';

import { GameWonDirective } from './shared/game-won.directive';
import { HoldableDirective } from './shared/holdable.directive';
import { RoutingModule } from './routing.module';
import { AuthGuard } from './auth.guard';


@NgModule({
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    GameModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    StorageServiceModule,
    SharedModule,
    RoutingModule,
    ],
  declarations: [
    AppComponent,
    GameComponent,
    GameWonDirective,
    HoldableDirective,
    NavigationComponent,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule {
}
