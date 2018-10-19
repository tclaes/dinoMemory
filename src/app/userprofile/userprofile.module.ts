import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player/player.component';
import { SharedModule } from '../shared/shared.module';
import { UserprofileComponent } from './userprofile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from '../userprofile/register/register.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PlayerComponent,
    UserprofileComponent,
    RegisterComponent
  ],
  exports: [
    PlayerComponent, UserprofileComponent, CommonModule, FormsModule, RegisterComponent, ReactiveFormsModule
  ]
})
export class UserprofileModule { }
