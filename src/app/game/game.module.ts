import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserprofileModule} from '../user/userprofile.module';
import {ClicksComponent} from './clicks/clicks.component';
import {TimerComponent} from './timer/timer.component';

@NgModule({
  imports: [
    CommonModule,
    UserprofileModule,
    ClicksComponent,
    TimerComponent,
  ],
  exports: [
    UserprofileModule
   ]
})
export class GameModule { }
