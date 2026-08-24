import { Injectable, Renderer2 } from '@angular/core';
import { User } from '@angular/fire/auth';
import { DeckService } from '../shared/deck.service';
import { ScoreService } from './scoreboard/score.service';
import { LocalstorageService } from '../shared/localstorage.service';
import { TimerService } from './timer/timer.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared/shared.service';
import { Deck } from '../shared/deck.service';
import { AuthService } from '../auth.service';

@Injectable({providedIn: 'root'})
export class GameService {

  timer;
  private _timer: Subscription;
  deck: Deck;
  user: User;

  constructor(private deckSrv: DeckService,
    private scoreSrv: ScoreService, private local: LocalstorageService,
    private timerSrv: TimerService, private sharedSrv: SharedService,
    private authService: AuthService) {
      timerSrv.currentTime.subscribe(timer => this.timer = timer);
      sharedSrv.standardDeck.subscribe(deck => this.deck = deck);
      authService.User.subscribe(user => this.user = user);
    }

  renderer2: Renderer2;

  hasFlippedCard = false;
  private lockBoard;
  firstCard;
  secondCard;
  correctMatch = 0;

  gameWon = false;
  gameStarted = false;

  // Bumped on every newGame() and folded into the *ngFor track expression in
  // game.component.html. Without it, restarting with the SAME deck (the
  // "New Game" button) reuses the existing card elements -- Angular's track
  // matches on the card name string, which is unchanged -- so the 'flip'
  // and 'matched' classes added imperatively via Renderer2 would survive
  // the restart instead of being cleared.
  gameGeneration = 0;

  newGame() {
    this.gameStarted = false;
    this.gameWon = false;
    this.sharedSrv.cardClicked(0);
    this.correctMatch = 0;
    this.timerSrv.resetTimer();
    ++this.gameGeneration;
  }

  restart() {
    this.changeDeck(this.deck.name);
    this.newGame();
  }

  changeDeck(deck) {
    this.deckSrv.setDeckObservable(deck)
    .subscribe(card => {
      this.deck.name = card['name'];
      this.deck.cards = card['cards'];
      this.deck.imgUrl = card['imgURL'];
      this.deck.frontFace = card['frontFace'];
      this.sharedSrv.setDeck(this.deck);
    });
  }

  flipCard(e) {

    const clickedCard = e.currentTarget;
    if (clickedCard.classList.contains('flip')) {
      return;
    }
    if (!this.gameStarted) {
      this.timerSrv.startTimer();
      this.gameStarted = !this.gameStarted;
      this._timer = this.timerSrv.getTimer().subscribe();
      this.timerSrv.currentTime.subscribe(time => this.timer = time);
    }
    if (this.lockBoard) {
      return;
    }
    if (clickedCard === this.firstCard) {
      return;
    }


    this.renderer2.addClass(clickedCard, 'flip');

    if (!this.hasFlippedCard) {
      this.hasFlippedCard = true;
      this.firstCard = clickedCard;
      return;
    }

    this.secondCard = clickedCard;
    this.lockBoard = true;

    this.checkForMatch();
  }

  checkForMatch() {
    const isMatch = this.firstCard.getAttribute('identifier') === this.secondCard.getAttribute('identifier');
    isMatch ? this.disableCards() : this.unflipCards();
  }

  disableCards() {
    ++this.correctMatch;
    this.renderer2.addClass(this.firstCard, 'matched');
    this.renderer2.addClass(this.secondCard, 'matched');
    this.checkWin();
    this.resetBoard();
  }

  checkWin() {
      if (this.correctMatch === this.deck.cards.length) {
        this.gameWon = !this.gameWon;
        let clicks;
        this.sharedSrv.currentTimesClicked.subscribe(click => clicks = click);
        this._timer.unsubscribe();
        this.scoreSrv.updateScores(this.user.displayName, clicks , this.timer, this.deck.name);
      }
  }

  unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.renderer2.removeClass(this.firstCard, 'flip');
      this.renderer2.removeClass(this.secondCard, 'flip');
      this.lockBoard = false;
      this.resetBoard();
    }, 1000);
  }

  resetBoard() {
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }

  shuffle(card) {
      const randomPos = Math.floor(Math.random() * 12);
      this.renderer2.removeClass(card.nativeElement, 'flip');
      this.renderer2.setStyle(card.nativeElement, 'order', `${randomPos}`);
  }
}
