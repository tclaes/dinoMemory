import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DeckService } from './deck.service';

const fixture = {
  deck: [
    { name: 'frameworks', imgURL: 'frameworks', frontFace: 'js-badge', cards: ['angular', 'vue'] },
    { name: 'dinos', imgURL: 'dinos', frontFace: 'velociraptor', cards: ['allosaurus', 'stegosaurus'] }
  ]
};

describe('DeckService', () => {
  let service: DeckService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeckService]
    });
    service = TestBed.get(DeckService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getData() issues a single GET to the decks url and resolves with the response', fakeAsync(() => {
    let result: any;
    service.getData().then(data => result = data);

    const req = httpMock.expectOne(service.decksUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fixture);
    tick();

    expect(result).toEqual(fixture);
  }));

  it('getDataObservable() issues a single GET to the decks url', () => {
    let result: any;
    service.getDataObservable().subscribe(data => result = data);

    const req = httpMock.expectOne(service.decksUrl);
    req.flush(fixture);

    expect(result).toEqual(fixture);
  });

  it('setDeck() resolves to only the decks matching the given name', fakeAsync(() => {
    let result: any;
    service.setDeck('dinos').then(data => result = data);

    httpMock.expectOne(service.decksUrl).flush(fixture);
    tick();

    expect(result).toEqual([fixture.deck[1]]);
  }));

  it('setDeckObservable() flattens the deck array and filters it down to the matching name', () => {
    const emitted: any[] = [];
    service.setDeckObservable('dinos').subscribe(card => emitted.push(card));

    httpMock.expectOne(service.decksUrl).flush(fixture);

    expect(emitted).toEqual([fixture.deck[1]]);
  });
});
