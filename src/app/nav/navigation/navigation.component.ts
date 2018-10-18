import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeckService, Deck } from './../../shared/deck.service';
import { GameService } from './../../game/game.service';
import { SharedService } from './../../shared/shared.service';
import { Player } from './../../userprofile/player/player.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {

  decks$;
  _deck: Deck;
  player: Player;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public deck: DeckService,
    public game: GameService,
    public sharedService: SharedService) {
    this.decks$ = this.deck.getData().then(data => data['deck'].map(x => x));
    this.sharedService.standardDeck.subscribe(currentDeck => this._deck = currentDeck);
    this.sharedService.currentPlayer.subscribe(player => this.player = player);
  }

  newGame(e) {
    this.game.changeDeck(e.currentTarget.id);
    this.game.newGame();
  }

  logOut() {
    this.player.set = false;
    this.sharedService.logOut();
  }

}
