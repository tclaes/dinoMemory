import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Deck } from './deck.service';
import { Player } from '../game/player/player.component';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private local: LocalstorageService) { }

  private timesClicked = new BehaviorSubject<number>(1);
  currentTimesClicked = this.timesClicked.asObservable();

  private deck = new BehaviorSubject<Deck>({
    name: 'dinos'
  });
  standardDeck = this.deck.asObservable();

  private player = new BehaviorSubject<Player>({name: '', set: false});
  currentPlayer = this.player.asObservable();

  cardClicked(clicks) {
    this.timesClicked.next(clicks);
  }

  setDeck(deck: Deck) {
    console.log(`Standarddeck set to ${deck.imgUrl}`);
    this.deck.next(deck);
  }

  setPlayer(player: Player) {
    this.player.next(player);
    this.local.setUser(player.name);
  }

  logOut() {
    this.local.deleteUser();
    this.player.next({name: '', set: false});
  }
}
