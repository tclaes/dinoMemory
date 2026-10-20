import {Routes} from '@angular/router';
import {GameComponent} from './game/game.component';
import {UserprofileComponent} from './user/userprofile.component';
import {AuthGuard} from './core/auth/guards/auth.guard';
import {RegisterComponent} from './user/register/register.component';
import {LoginComponent} from './user/login/login.component';

export const routes: Routes = [
  {path: '', component: GameComponent, canActivate: [AuthGuard]},
  {path: 'game/:deck', component: GameComponent, canActivate: [AuthGuard]},
  {path: 'user', component: UserprofileComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: '/'}
];
