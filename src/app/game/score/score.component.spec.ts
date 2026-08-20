import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ScoreComponent } from './score.component';
import { DeckService } from '../../shared/deck.service';
import { GameService } from '../game.service';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;
  let deckSrvSpy: jasmine.SpyObj<DeckService>;
  const decksFixture = { deck: [{ name: 'dinos' }, { name: 'frameworks' }] };

  beforeEach(() => {
    deckSrvSpy = jasmine.createSpyObj('DeckService', ['getData']);
    deckSrvSpy.getData.and.returnValue(Promise.resolve(decksFixture));

    TestBed.configureTestingModule({
      declarations: [ScoreComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: DeckService, useValue: deckSrvSpy },
        { provide: GameService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('ngOnInit() loads and maps the deck list', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    let result: any;
    component.decks$.then(data => (result = data));
    tick();

    expect(result).toEqual(decksFixture.deck);
  }));
});
