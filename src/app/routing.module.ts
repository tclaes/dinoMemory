import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  {path: 'game', component: GameComponent},
  {path: '', redirectTo: '/'}
];


export const routingModule: ModuleWithProviders = RouterModule.forRoot(routes);
