import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting,} from '@angular/common/http/testing';

import {DeckService} from './deck.service';
import {provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';

const fixture = {
  deck: [
    {
      name: "frameworks",
      imgURL: "frameworks",
      frontFace: "js-badge",
      cards: ["angular", "vue"],
    },
    {
      name: "dinos",
      imgURL: "dinos",
      frontFace: "velociraptor",
      cards: ["allosaurus", "stegosaurus"],
    },
  ],
};

describe("DeckService", () => {
  let service: DeckService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DeckService,
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(DeckService);
    httpMock = TestBed.inject(HttpTestingController);

    // The decks signal (toSignal) requests the deck list as soon as the service is created.
    const req = httpMock.expectOne(service.decksUrl);
    expect(req.request.method).toBe("GET");
    req.flush(fixture);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("availableDecks() exposes the loaded deck list", () => {
    expect(service.availableDecks()).toEqual(fixture.deck);
  });

  it("selectedDeck() defaults to the dinos deck", () => {
    expect(service.selectedDeck()).toEqual(fixture.deck[1]);
  });

  it("selectDeck() switches the selected deck by name", () => {
    service.selectDeck("frameworks");
    expect(service.selectedDeck()).toEqual(fixture.deck[0]);
  });

  it("getDataObservable() issues a single GET to the decks url", () => {
    let result: any;
    service.getDataObservable().subscribe((data) => (result = data));

    const req = httpMock.expectOne(service.decksUrl);
    req.flush(fixture);

    expect(result).toEqual(fixture);
  });

  it("setDeckObservable() flattens the deck array and filters it down to the matching name", () => {
    const emitted: any[] = [];
    service.setDeckObservable("dinos").subscribe((card) => emitted.push(card));

    httpMock.expectOne(service.decksUrl).flush(fixture);

    expect(emitted).toEqual([fixture.deck[1]]);
  });
});
