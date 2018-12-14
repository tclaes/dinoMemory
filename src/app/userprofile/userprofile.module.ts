import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UserprofileComponent } from './userprofile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from '../userprofile/register/register.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { StatsComponent } from './stats/stats.component';
import { LineChartComponent } from './stats/line-chart/line-chart.component';
import {ChartModule} from 'primeng/chart';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    ChartModule,
  ],
  declarations: [
    UserprofileComponent,
    RegisterComponent,
    LoginComponent,
    StatsComponent,
    LineChartComponent
  ],
  exports: [
    UserprofileComponent, CommonModule, FormsModule, RegisterComponent, ReactiveFormsModule
  ]
})
export class UserprofileModule { }
