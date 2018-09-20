import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DeckService } from './deck.service';

describe('DeckService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [ DeckService ]
  }));


  it('should fetch a list of people', inject(
    [ DeckService],
    (deckService: DeckService) => {
    expect(deckService).toBeDefined();
  }));

});
