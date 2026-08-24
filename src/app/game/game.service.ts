import {inject, Injectable, Renderer2, signal} from '@angular/core';
import {DeckService} from '../shared/deck.service';
import {ScoreService} from './scoreboard/score.service';
import {TimerService} from './timer/timer.service';
import {SharedService} from '../shared/shared.service';
import {AuthService} from '../auth.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class GameService {

  #deckService = inject(DeckService)
  #scoreService = inject(ScoreService)
  #timerService = inject(TimerService)
  #sharedService = inject(SharedService)
  #authService = inject(AuthService)

  deck = this.#deckService.selectedDeck
  timer = this.#timerService.currentTime
  user = toSignal(this.#authService.User)

  renderer2: Renderer2;

  hasFlippedCard = false;
  private lockBoard: boolean;
  firstCard;
  secondCard;
  correctMatch = 0;

  gameWon = false;
  gameStarted = signal(false);

  // Bumped on every newGame() and folded into the *ngFor track expression in
  // game.component.html. Without it, restarting with the SAME deck (the
  // "New Game" button) reuses the existing card elements -- Angular's track
  // matches on the card name string, which is unchanged -- so the 'flip'
  // and 'matched' classes added imperatively via Renderer2 would survive
  // the restart instead of being cleared.
  gameGeneration = 0;

  newGame(deck = 'dinos') {
    this.gameStarted.set(false);
    this.gameWon = false;
    this.#sharedService.cardClicked(0);
    this.correctMatch = 0;
    this.#timerService.resetTimer();
    ++this.gameGeneration;
    this.changeDeck(deck)
  }

  restart() {
    this.resetBoard();
    this.newGame(this.deck().name);
  }

  changeDeck(deck: string) {
    this.#deckService.selectDeck(deck);
  }

  flipCard(e) {

    const clickedCard = e.currentTarget;
    if (clickedCard.classList.contains('flip')) {
      return;
    }
    if (!this.gameStarted()) {
      this.#timerService.startTimer();
      this.gameStarted.set(true);
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
      if (this.correctMatch === this.deck()?.cards?.length) {
        this.gameWon = !this.gameWon;
        let clicks: number;
        this.#sharedService.currentTimesClicked.subscribe(click => clicks = click);
        this.#scoreService.updateScores(this.user().displayName, clicks , this.timer, this.deck.name);
      }
  }

  unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.resetBoard();
      this.lockBoard = false;
    }, 1000);
  }

  resetBoard() {
    if(this.firstCard){
      this.renderer2.removeClass(this.firstCard, 'flip');
    }
    if(this.secondCard){
      this.renderer2.removeClass(this.secondCard, 'flip');
    }

    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }

  shuffle(card) {
      const randomPos = Math.floor(Math.random() * 12);
      this.renderer2.removeClass(card.nativeElement, 'flip');
      this.renderer2.setStyle(card.nativeElement, 'order', `${randomPos}`);
  }
}
