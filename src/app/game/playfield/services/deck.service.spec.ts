import {describe, expect, it} from 'vitest';
import {Component, inject} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {fireEvent, render, screen} from '@testing-library/angular';

import {DeckService} from './deck.service';

const decks = {
  deck: [
    {name: 'dinos', imgURL: 'dinos', frontFace: 'velociraptor', cards: ['allosaurus', 'ankylosaurus']},
    {name: 'frameworks', imgURL: 'frameworks', frontFace: 'js-badge', cards: ['angular', 'react']}
  ]
};

// DeckService is signal-only, so exercise it through a minimal host that renders its state.
@Component({
  template: `
    <p data-testid="selected">{{ deckService.selectedDeck()?.name }}</p>
    <ul aria-label="available decks">
      @for (deck of deckService.availableDecks(); track deck.name) {
        <li>
          <button type="button" (click)="deckService.selectDeck(deck.name)">{{ deck.name }}</button>
        </li>
      }
    </ul>
    <ul aria-label="cards">
      @for (card of deckService.selectedDeck()?.cards; track card) {
        <li>{{ card }}</li>
      }
    </ul>
  `
})
class HostComponent {
  deckService = inject(DeckService);
}

async function setup() {
  const view = await render(HostComponent, {
    providers: [provideHttpClient(), provideHttpClientTesting()]
  });
  const http = view.fixture.debugElement.injector.get(HttpTestingController);
  http.expectOne('../../assets/data.json').flush(decks);
  view.detectChanges();
  return view;
}

describe('DeckService', () => {
  it('lists the available decks once loaded', async () => {
    await setup();

    expect(screen.getByRole('button', {name: 'dinos'})).toBeTruthy();
    expect(screen.getByRole('button', {name: 'frameworks'})).toBeTruthy();
  });

  it('selects the dinos deck by default', async () => {
    await setup();

    expect(screen.getByTestId('selected').textContent).toBe('dinos');
    expect(screen.getByText('allosaurus')).toBeTruthy();
  });

  it('switches the selected deck when selectDeck() is called', async () => {
    await setup();

    fireEvent.click(screen.getByRole('button', {name: 'frameworks'}));

    expect(screen.getByTestId('selected').textContent).toBe('frameworks');
    expect(screen.getByText('angular')).toBeTruthy();
    expect(screen.queryByText('allosaurus')).toBeNull();
  });
});
