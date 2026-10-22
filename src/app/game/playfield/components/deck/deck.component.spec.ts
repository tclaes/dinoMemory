import {ComponentFixture, TestBed} from '@angular/core/testing';
import {signal} from '@angular/core';

import {DeckComponent} from './deck.component';
import {BoardCard, GameService} from '../../services/game.service';
import {Deck} from '../../model/deck';
import {createSpyObj, SpyObj} from '../../../../../testing/spy';

describe('DeckComponent', () => {
  let component: DeckComponent;
  let fixture: ComponentFixture<DeckComponent>;
  let gameSrvSpy: SpyObj<GameService>;
  const deck: Deck = {name: 'dinos', imgURL: 'dinos', frontFace: 'front', cards: ['a', 'b']};

  beforeEach(async () => {
    gameSrvSpy = createSpyObj('GameService', ['flipCard']);
    const board: BoardCard[] = [
      {id: 'a-a', name: 'a', coverIndex: 0},
      {id: 'b-a', name: 'b', coverIndex: 1},
      {id: 'a-b', name: 'a', coverIndex: 1},
      {id: 'b-b', name: 'b', coverIndex: 2}
    ];
    Object.assign(gameSrvSpy, {
      board: signal(board),
      faceUpIds: signal(new Set(['a-a', 'a-b'])),
      matchedIds: signal(new Set(['a-a', 'a-b']))
    });

    await TestBed.configureTestingModule({
      imports: [DeckComponent],
      providers: [{provide: GameService, useValue: gameSrvSpy}]
    }).compileComponents();

    fixture = TestBed.createComponent(DeckComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('deck', deck);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a card for every board entry', () => {
    expect(fixture.nativeElement.querySelectorAll('app-card').length).toBe(4);
  });

  it('binds flip and matched classes from the game state', () => {
    const cards: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('app-card'));

    expect(cards.map(c => c.classList.contains('flip'))).toEqual([true, false, true, false]);
    expect(cards.map(c => c.classList.contains('matched'))).toEqual([true, false, true, false]);
  });

  it('clicking a card flips it by id', () => {
    fixture.nativeElement.querySelectorAll('app-card')[1].click();

    expect(gameSrvSpy.flipCard).toHaveBeenCalledWith('b-a');
  });
});
