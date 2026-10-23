import {Component, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DeckService} from '../../game/playfield/services/deck.service';
import {AuthService} from '../../core/auth/services/auth.service';
import {RouterLink} from '@angular/router';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {AsyncPipe, NgClass} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {User} from '@angular/fire/auth';

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
  authService = inject(AuthService);
  deckService = inject(DeckService);

  decks$ = this.deckService.availableDecks;
  deck = this.deckService.selectedDeck;
  user = toSignal<User>(this.authService.User);
  #breakpointObserver = inject(BreakpointObserver);
  isHandset$: Observable<boolean> = this.#breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  selectDeck(e) {
    this.deckService.selectDeck(e);
  }

  logOut() {
    this.authService.logOut();
  }

}
