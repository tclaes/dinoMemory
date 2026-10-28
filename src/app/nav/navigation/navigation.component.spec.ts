import {describe, expect, it, vi} from 'vitest';
import {signal} from '@angular/core';
import {of} from 'rxjs';
import {render, screen} from '@testing-library/angular';
import {NavigationComponent} from './navigation.component';
import {AuthService} from '../../core/auth/services/auth.service';
import {DeckService} from '../../game/playfield/services/deck.service';

const authService = {
   User: of(null),
   logOut: () => {},
 }

 const deckService = {
  availableDecks: signal([]),
   selectedDeck: signal(undefined)}


describe('NavigationComponent', () => {
  it('should render the deck navigation', async () => {
    await render(NavigationComponent, {
      routes: [],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: DeckService, useValue: deckService}
      ]
    });

    expect(screen.getByRole('navigation', {name: /choose a card set/i})).toBeTruthy();
  });

  it('should link to the profile page', async () => {
    await render(NavigationComponent, {
      routes: [],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: DeckService, useValue: deckService}
      ]
    });

    expect(screen.getByRole('link', {name: /your profile/i})).toBeTruthy();
  });

  it('should logout when user clicks logout button', async () => {
    const logOut = vi.fn();
    await render(NavigationComponent, {
      providers:[
        {provide: AuthService, useValue: {...authService, User: of({uid: 1}), logOut}},
        {provide: DeckService, useValue: deckService}
      ]
    })

    screen.getByRole('button', {name: /bye!/i}).click();

    expect(logOut).toHaveBeenCalled();
  })

  it('should navigate to the game when clicked on a nav deck item', async () => {
    const selectDeck = vi.fn();
    await render(NavigationComponent, {
      routes: [],
      providers:[
        {provide: AuthService, useValue: {...authService, User: of({uid: 1})}},
        {provide: DeckService, useValue: {...deckService, availableDecks: signal([{name: 'dinos'}]), selectDeck}}
      ]
    })

    screen.getAllByRole('button', {name: 'dinos'})[0].click();

    expect(selectDeck).toHaveBeenCalled();

  })
});
