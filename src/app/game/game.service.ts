import { Injectable, Renderer, OnInit } from '@angular/core';
import { DeckService } from '../shared/deck.service';
import { ScoreService } from './scoreboard/score.service';

@Injectable({providedIn: 'root'})
export class GameService implements OnInit {

  constructor(private deckSrv: DeckService, private scoreSrv: ScoreService) { }

  renderer: Renderer;
  deck$;
  standardDeck;
  cards$;
  imgUrl;
  frontFace;

  hasFlippedCard = false;
  lockBoard;
  firstCard;
  secondCard;
  correctMatch = 0;
  nrOfClicks = 0;

  gameWon = false;
  modalWon;
  gameStarted = false;
  time;
  timer = '0h - 0m - 0s';

  newGame(e) {

    this.gameStarted = false;
    this.gameWon = false;
    this.nrOfClicks = 0;
    this.correctMatch = 0;

    if (e.target !== undefined && e.target !== 'won') {
      this.standardDeck = {id: e.target.id };
    }

    this.deck$ = this.deckSrv.setDeck(this.standardDeck.id);

    this.deck$.then(card => {
      this.cards$ = card[0].cards;
      this.imgUrl = card[0].imgURL;
      this.frontFace = card[0].frontFace;
    });

    clearInterval(this.time);

  }

  flipCard(e) {

    const clickedCard = e.currentTarget;
    if (clickedCard.classList.contains('flip')) {
      return;
    }
    if (!this.gameStarted) {
      this.gameStarted = !this.gameStarted;
      this.startTimer();
    }
    if (this.lockBoard) {
      return;
    }
    if (clickedCard === this.firstCard) {
      return;
    }

    ++this.nrOfClicks;

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

    // this.firstCard.removeEventListener('click', this.flipCard);
    // this.secondCard.removeEventListener('click', this.flipCard);
    this.resetBoard();
  }

  checkWin() {
    this.deck$.then(deck => {
      if (this.correctMatch === deck[0].cards.length) {
        clearInterval(this.time);
        this.gameWon = !this.gameWon;
        this.scoreSrv.updateScores('Tom', this.nrOfClicks, this.timer, this.standardDeck);
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

  ngOnInit(): void {
  }

  startTimer() {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    this.time = setInterval(() => {
      if (seconds < 59) {
        seconds++;
      } else {
        seconds = 0;
        if (minutes < 59) {
          minutes++;
        } else {
          if (hours < 24) {
            hours++;
          }
        }
      }
      this.timer = `
      ${hours}h - ${minutes}m - ${seconds}s
    `;
    }, 1000);
  }
}
