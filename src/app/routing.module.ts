import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { GameComponent } from './game/game.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

const routes: Routes = [
  {path: 'game', component: GameComponent},
  {path: 'userprofile', component: UserprofileComponent},
  {path: '', redirectTo: '/game', pathMatch: 'full'}
];

export const RoutingModule = RouterModule.forRoot(routes);
