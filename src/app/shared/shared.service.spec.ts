import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedService);
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

  it('exposes the default "dinos" deck', () => {
    expect(service.standardDeck()).toEqual({ name: 'dinos' });
  });
});
