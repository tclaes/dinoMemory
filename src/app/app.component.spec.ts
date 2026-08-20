import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { GameService } from './game/game.service';
import { SharedService } from './shared/shared.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let gameSrvSpy: jasmine.SpyObj<GameService>;

  beforeEach(() => {
    gameSrvSpy = jasmine.createSpyObj('GameService', ['changeDeck']);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: GameService, useValue: gameSrvSpy },
        SharedService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('loads the current standard deck on construction', () => {
    expect(gameSrvSpy.changeDeck).toHaveBeenCalledWith('dinos');
  });
});
