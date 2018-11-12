import { RouterModule, Routes, Router } from '@angular/router';
import { GameComponent } from './game/game.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './userprofile/register/register.component';
import { LoginComponent } from './userprofile/login/login.component';

const routes: Routes = [
  {path: '', component: GameComponent, canActivate: [AuthGuard]},
  {path: 'game', component: GameComponent, canActivate: [AuthGuard]},
  {path: 'userprofile', component: UserprofileComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: '/'}
];

export const RoutingModule = RouterModule.forRoot(routes);
