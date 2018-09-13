import { Injectable, Renderer, ElementRef, AfterViewInit, ViewChild, ViewChildren } from '@angular/core';
import { DeckService } from '../shared/deck.service';

@Injectable({
  providedIn: 'root'
})
export class GameService implements AfterViewInit {

  constructor(private deckSrv: DeckService) { }

  @ViewChildren('card') card: ElementRef;

  renderer: Renderer;
  deck$;
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
  gameStarted = false;
  time;

  newGame(e) {
    this.deckSrv.setDeck(e);

    clearInterval(this.time);
    this.gameStarted = false;
    this.gameWon = false;
    this.loadGame(e.target.id);
  }

  loadGame(deck) {
    this.deck$ = this.deckSrv
      .getData()
      .then(data => data['deck'].filter(x => x.name === deck))
      .then(card => {
        this.cards$ = card[0].cards;
        this.imgUrl = card[0].imgURL;
        this.frontFace = card[0].frontFace;
      });


    this.correctMatch = 0;
    this.nrOfClicks = 0;

    // this.clicks = `Clicks: ${this.nrOfClicks}`;
    // this.timer = '0h - 0m - 0s';

    // this.shuffle();
  }

  flipCard(e) {
    const clickedCard = e.currentTarget;
    if (!this.gameStarted) {
      this.gameStarted = !this.gameStarted;
      // this.startTimer();
    }
    if (this.lockBoard) {
      return;
    }
    // this.clicks = `Clicks: ${++this.nrOfClicks}`;
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
    // this.checkWin();

    // this.firstCard.removeEventListener('click', this.flipCard);
    // this.secondCard.removeEventListener('click', this.flipCard);
    this.resetBoard();
  }

  checkWin() {
    console.log('Correcte match');
    // this.deck.then(deck => {
    //   if (this.correctMatch === deck[0].cards.length) {
    //     clearInterval(this.time);
    //     this.gameWon = !this.gameWon;
    //     const won = document.createElement('div');
    //     won.classList.add('won');
    //     won.innerHTML = `
    //     <div>
    //       <button id="won" class="button">New game?</button>
    //     </div>
    //   `;
    //     document.body.append(won);
    //     document.getElementById('won').addEventListener('click', this.newGame);
    //   }
    // });
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

  // shuffle() {
  //   this.cards.forEach(card => {
  //     console.log('Kaart: ', card);
  //     const randomPos = Math.floor(Math.random() * 12);
  //     card.style.order = randomPos;
  //   });
  // }

  // startTimer() {
  //   let hours = 0;
  //   let minutes = 0;
  //   let seconds = 0;

  //   this.time = setInterval(() => {
  //     if (seconds < 60) {
  //       seconds++;
  //     } else {
  //       seconds = 0;
  //       if (minutes < 60) {
  //         minutes++;
  //       } else {
  //         if (hours < 24) {
  //           hours++;
  //         }
  //       }
  //     }
  //     this.timer = `
  //     ${hours}h - ${minutes}m - ${seconds}s
  //   `;
  //   }, 1000);
  // }

  ngAfterViewInit(): void {
  }

}
