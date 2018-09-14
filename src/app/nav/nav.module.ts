import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClicksComponent } from './clicks/clicks.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ClicksComponent],
  exports: [ClicksComponent]
})
export class NavModule { }
