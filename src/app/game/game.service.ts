import { Injectable, Renderer, OnInit } from '@angular/core';
import { DeckService } from '../shared/deck.service';
import { ScoreService } from './scoreboard/score.service';
import { LocalstorageService } from '../shared/localstorage.service';
import { TimerService } from './timer/timer.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared/shared.service';

@Injectable({providedIn: 'root'})
export class GameService {

  constructor(private deckSrv: DeckService,
    private scoreSrv: ScoreService, private local: LocalstorageService,
    private timerSrv: TimerService, private sharedSrv: SharedService) { }

  renderer: Renderer;
  private _timer: Subscription;
  deck$;
  standardDeck;
  cards$;
  imgUrl;
  frontFace;

  hasFlippedCard = false;
  private lockBoard;
  firstCard;
  secondCard;
  correctMatch = 0;

  gameWon = false;
  gameStarted = false;
  timer = '0h - 0m - 0s';

  newGame(e) {

    this.gameStarted = false;
    this.gameWon = false;
    this.sharedSrv.cardClicked(0);
    this.correctMatch = 0;

    if (e.target !== undefined && e.target !== 'won') {
      this.standardDeck = {id: e.currentTarget.id };
    }

    this.deck$ = this.deckSrv.setDeck(this.standardDeck.id);

    this.deck$.then(card => {
      this.cards$ = card[0].cards;
      this.imgUrl = card[0].imgURL;
      this.frontFace = card[0].frontFace;
    });

    this.timer = '0h - 0m - 0s';

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

      this.timerSrv.currentTime.subscribe(time => {
        this.timer = time;
      });

    }
    if (this.lockBoard) {
      return;
    }
    if (clickedCard === this.firstCard) {
      return;
    }

    this.renderer.setElementClass(clickedCard, 'flip', true);

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
    this.checkWin();
    this.resetBoard();
  }

  checkWin() {
    this.deck$.then(deck => {
      if (this.correctMatch === deck[0].cards.length) {
        this.gameWon = !this.gameWon;
        let clicks;
        this.sharedSrv.currentTimesClicked.subscribe(click => clicks = click);
        this._timer.unsubscribe();
        this.scoreSrv.updateScores(this.local.getUser(), clicks , this.timer, this.standardDeck);
      }
    });
  }

  unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.renderer.setElementClass(this.firstCard, 'flip', false);
      this.renderer.setElementClass(this.secondCard, 'flip', false);
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
      this.renderer.setElementClass(card.nativeElement, 'flip', false);
      this.renderer.setElementStyle(card.nativeElement, 'order', `${randomPos}`);
  }
}
