import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule, MatIconModule, MatMenuModule, MatToolbarModule, MatInputModule,
  MatSidenavModule, MatListModule, MatTableModule, MatCardModule, MatGridListModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, MatCheckboxModule, MatInputModule,
    MatIconModule, MatMenuModule,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatTableModule, MatCardModule, MatGridListModule,
  ],
  declarations: [],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, MatCheckboxModule, MatInputModule,
    MatIconModule, MatMenuModule,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatTableModule, MatCardModule, MatGridListModule,
  ]
})
export class SharedModule { }
