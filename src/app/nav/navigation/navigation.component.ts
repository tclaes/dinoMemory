import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeckService, Deck } from './../../shared/deck.service';
import { GameService } from './../../game/game.service';
import { SharedService } from './../../shared/shared.service';
import { AuthService } from './../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  decks$;
  _deck: Deck;
  user: firebase.User;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public deck: DeckService,
    public game: GameService,
    public sharedService: SharedService,
    public authService: AuthService,
    private router: Router) {
    this.decks$ = this.deck.getData().then(data => data['deck'].map(x => x));
    sharedService.standardDeck.subscribe(currentDeck => this._deck = currentDeck);
    authService.User.subscribe(user => this.user = user);
  }

  newGame(e) {
    this.game.changeDeck(e.currentTarget.innerText);
    this.game.newGame();
    this.router.navigate(['/game']);
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/login']);
  }

}
