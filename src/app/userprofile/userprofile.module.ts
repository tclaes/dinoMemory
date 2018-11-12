import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserprofileComponent } from './userprofile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from '../userprofile/register/register.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    UserprofileComponent,
    RegisterComponent,
    LoginComponent
  ],
  exports: [
    UserprofileComponent, CommonModule, FormsModule, RegisterComponent, ReactiveFormsModule
  ]
})
export class UserprofileModule { }
