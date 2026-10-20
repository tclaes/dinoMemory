import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DeckService} from '../../shared/deck.service';
import {GameService} from '../../game/playfield/services/game.service';
import {AuthService} from '../../core/auth/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {AsyncPipe, NgClass} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [
    MatSidenavContainer,
    MatSidenav,
    NgClass,
    AsyncPipe,
    MatSidenavContent,
    RouterLink
  ]
})
export class NavigationComponent {
  deckService = inject(DeckService)
  gameService = inject(GameService)
  authService = inject(AuthService)
  #breakpointObserver = inject(BreakpointObserver)
  #router = inject(Router)

  decks$ = this.deckService.availableDecks
  _deck = this.deckService.selectedDeck
  user = toSignal(this.authService.User)

  isHandset$: Observable<boolean> = this.#breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  newGame(e) {
    const deck = e.currentTarget.innerText.toLowerCase()
    console.log(deck);
    this.gameService.newGame(deck);
    this.#router.navigate(['game', deck]);
  }

  logOut() {
    this.authService.logOut();
    this.#router.navigate(['/login']);
  }

}
