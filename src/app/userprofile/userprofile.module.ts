import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player/player.component';
import { SharedModule } from '../shared/shared.module';
import { UserprofileComponent } from './userprofile.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from '../userprofile/register/register.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    PlayerComponent,
    UserprofileComponent,
    RegisterComponent
  ],
  exports: [
    PlayerComponent, UserprofileComponent, CommonModule, FormsModule
  ]
})
export class UserprofileModule { }
