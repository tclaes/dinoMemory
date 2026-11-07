import {describe, expect, it, vi} from 'vitest';
import {Component, signal} from '@angular/core';
import {Router} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {render, screen} from '@testing-library/angular';
import {NavigationComponent} from './navigation.component';
import {AuthService} from '../../core/auth/services/auth.service';
import {DeckService} from '../../game/playfield/services/deck.service';

@Component({template: ''})
class EmptyPageComponent {}

const routes = [
  {path: '', component: EmptyPageComponent},
  {path: 'game/:deck', component: EmptyPageComponent},
  {path: 'user', component: EmptyPageComponent},
];

const authService = {
  User: of(null),
  logOut: () => {},
};

const decks = [{name: 'dinos'}, {name: 'alfabet'}];

const renderNav = async ({url = '/', selected = 'dinos', logOut = authService.logOut} = {}) => {
  const result = await render(NavigationComponent, {
    routes,
    providers: [
      {provide: AuthService, useValue: {...authService, logOut}},
      {provide: DeckService, useValue: {availableDecks: signal(decks), selectedDeck: signal({name: selected})}},
    ],
  });
  await result.navigate(url);
  result.fixture.detectChanges();
  return result;
};

describe('NavigationComponent', () => {
  it('should render the deck navigation', async () => {
    await renderNav();

    expect(screen.getByRole('navigation', {name: /choose a card set/i})).toBeTruthy();
  });

  it('renders every deck as a link to its game address', async () => {
    await renderNav();

    expect(screen.getByRole('link', {name: 'dinos'}).getAttribute('href')).toBe('/game/dinos');
    expect(screen.getByRole('link', {name: 'alfabet'}).getAttribute('href')).toBe('/game/alfabet');
    expect(screen.queryByRole('button', {name: 'dinos'})).toBeNull();
    expect(screen.queryByRole('button', {name: 'alfabet'})).toBeNull();
  });

  it('opens the game with the chosen deck', async () => {
    await renderNav({url: '/user'});

    screen.getByRole('link', {name: 'alfabet'}).click();

    await vi.waitFor(() => expect(TestBed.inject(Router).url).toBe('/game/alfabet'));
  });

  it('marks only the shown deck as the current page', async () => {
    await renderNav({url: '/game/alfabet', selected: 'alfabet'});

    expect(screen.getByRole('link', {name: 'alfabet'}).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', {name: 'dinos'}).hasAttribute('aria-current')).toBe(false);
  });

  it('marks the default deck as current on the start page', async () => {
    await renderNav({url: '/'});

    expect(screen.getByRole('link', {name: 'dinos'}).getAttribute('aria-current')).toBe('page');
  });

  it('marks no deck as current on the profile page', async () => {
    await renderNav({url: '/user'});

    expect(screen.getByRole('link', {name: 'dinos'}).hasAttribute('aria-current')).toBe(false);
    expect(screen.getByRole('link', {name: 'alfabet'}).hasAttribute('aria-current')).toBe(false);
  });

  it('should link to the profile page', async () => {
    await renderNav();

    expect(screen.getByRole('link', {name: /your profile/i}).getAttribute('href')).toBe('/user');
  });

  it('should logout when user clicks logout button', async () => {
    const logOut = vi.fn();
    await renderNav({logOut});

    screen.getByRole('button', {name: /bye!/i}).click();

    expect(logOut).toHaveBeenCalled();
  });
});
