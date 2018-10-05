import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatInputModule, 
  MatSidenavModule, MatListModule, MatTableModule, MatCardModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, MatCheckboxModule, MatInputModule,
    MatIconModule, MatMenuModule,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatTableModule, MatCardModule,
  ],
  declarations: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, MatCheckboxModule, MatInputModule,
    MatIconModule, MatMenuModule,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatTableModule, MatCardModule,
  ]
})
export class SharedModule { }
