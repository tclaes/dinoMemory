import { RouterModule, Routes, Router } from '@angular/router';
import { GameComponent } from './game/game.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './userprofile/register/register.component';
import { LoginComponent } from './userprofile/login/login.component';

const routes: Routes = [
  {path: 'game', component: GameComponent},
  {path: 'userprofile', component: UserprofileComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

export const RoutingModule = RouterModule.forRoot(routes);
