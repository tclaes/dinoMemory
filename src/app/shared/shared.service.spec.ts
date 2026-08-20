import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(SharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('emits the initial click count of 1 before any card is clicked', () => {
    let value: number;
    service.currentTimesClicked.subscribe(v => value = v);
    expect(value).toBe(1);
  });

  it('cardClicked() pushes the new click count', () => {
    let value: number;
    service.currentTimesClicked.subscribe(v => value = v);
    service.cardClicked(5);
    expect(value).toBe(5);
  });

  it('emits the default "dinos" deck before any deck is set', () => {
    let deck: any;
    service.standardDeck.subscribe(d => deck = d);
    expect(deck).toEqual({ name: 'dinos' });
  });

  it('setDeck() pushes the new deck', () => {
    let deck: any;
    service.standardDeck.subscribe(d => deck = d);
    service.setDeck({ name: 'sharks' });
    expect(deck).toEqual({ name: 'sharks' });
  });
});
