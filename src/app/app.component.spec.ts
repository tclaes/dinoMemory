import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { GameService } from './game/game.service';
import { SharedService } from './shared/shared.service';
import { SpyObj, createSpyObj } from '../testing/spy';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let gameSrvSpy: SpyObj<GameService>;

  beforeEach(() => {
    gameSrvSpy = createSpyObj('GameService', ['changeDeck']);

    TestBed.configureTestingModule({
      imports: [AppComponent],
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
