import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ClicksComponent } from './clicks.component';
import { SharedService } from '../../shared/shared.service';

describe('ClicksComponent', () => {
  let component: ClicksComponent;
  let fixture: ComponentFixture<ClicksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClicksComponent],
      providers: [
        { provide: SharedService, useValue: { currentTimesClicked: of(7) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('picks up the current click count from SharedService and renders it', () => {
    expect(component.nrOfClicks).toBe(7);
    expect(fixture.nativeElement.textContent).toContain('7');
  });
});
