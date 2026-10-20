import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent]
    });
    // Navigation and the router outlet are out of scope here; render them as unknown elements.
    TestBed.overrideComponent(AppComponent, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } });

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the navigation shell', () => {
    expect(fixture.nativeElement.querySelector('app-navigation')).toBeTruthy();
  });
});
