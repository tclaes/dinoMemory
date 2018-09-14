import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DeckService } from './shared/deck.service';
import { GameService } from './game/game.service';

@Component({
  selector: 'app-main',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(private deck: DeckService, private gameSrv: GameService) {}

  @ViewChild('won') win: ElementRef;

  ngOnInit(): void {
    // this.loadGame(this.deck);
  }

  ngAfterViewInit(): void {
    this.gameSrv.modalWon = this.win.nativeElement;
    console.log(this.win.nativeElement);
  }

  // newGame() {
  //   if (this.gameWon) {
  //     document.querySelector('.won').remove();
  //   }
  //   clearInterval(this.time);
  //   this.gameStarted = false;
  //   this.gameWon = false;
  //   this.loadGame(this.deck);
  // }

  // loadGame(deck) {
  //   this.correctMatch = 0;
  //   this.nrOfClicks = 0;

  //   this.memoryBoard = '';
  //   this.clicks = `Clicks: ${this.nrOfClicks}`;
  //   this.timer = '0h - 0m - 0s';

  //   deck.then(deck => {
  //     deck[0].cards.forEach(card => {
  //       this.memoryBoard += `
  //       <div class="memory-card" data-framework="${card}">
  //           <img src="img/${
  //             deck[0].imgURL
  //           }/${card}.svg" alt="${card}" class="front-face">
  //           <img src="img/${deck[0].imgURL}/${
  //         deck[0].frontfase
  //       }.svg" alt="Memory Card" class="back-face">
  //       </div>
  //       <div class="memory-card" data-framework="${card}">
  //           <img src="img/${
  //             deck[0].imgURL
  //           }/${card}.svg" alt="${card}" class="front-face">
  //           <img src="img/${deck[0].imgURL}/${
  //         deck[0].frontfase
  //       }.svg" alt="Memory Card" class="back-face">
  //       </div>
  //       `;
  //     });

      // this.cards = document.querySelectorAll('.memory-card');

      // this.cards.forEach(card => {
      //   return card.addEventListener('click', this.flipCard);
      // });

      // this.shuffle();
  //   });
  // }

  // flipCard() {
  //   if (!this.gameStarted) {
  //     this.gameStarted = !this.gameStarted;
  //     this.startTimer();
  //   }
  //   if (this.lockBoard) {
  //     return;
  //   }
  //   this.clicks = `Clicks: ${++this.nrOfClicks}`;
  //   if (this === this.firstCard) {
  //     return;
  //   }
  //   this.classList.add('flip');

  //   if (!this.hasFlippedCard) {
  //     this.hasFlippedCard = true;
  //     this.firstCard = this;
  //     return;
  //   }

  //   this.secondCard = this;
  //   this.lockBoard = true;

  //   this.checkForMatch();
  // }

  // checkForMatch = () => {
  //   const isMatch =
  //     this.firstCard.dataset.framework === this.secondCard.dataset.framework;
  //   isMatch ? this.disableCards() : this.unflipCards();
  // }

  // disableCards = () => {
  //   ++this.correctMatch;
  //   this.checkWin();

  //   this.firstCard.removeEventListener('click', this.flipCard);
  //   this.secondCard.removeEventListener('click', this.flipCard);
  //   this.resetBoard();
  // }

  // checkWin = () => {
  //   this.deck.then(deck => {
  //     if (this.correctMatch === deck[0].cards.length) {
  //       clearInterval(this.time);
  //       this.gameWon = !this.gameWon;
  //       const won = document.createElement('div');
  //       won.classList.add('won');
  //       won.innerHTML = `
  //       <div>
  //         <button id="won" class="button">New game?</button>
  //       </div>
  //     `;
  //       document.body.append(won);
  //       document.getElementById('won').addEventListener('click', this.newGame);
  //     }
  //   });
  // }

  // unflipCards = () => {
  //   this.lockBoard = true;
  //   setTimeout(() => {
  //     this.firstCard.classList.remove('flip');
  //     this.secondCard.classList.remove('flip');

  //     this.lockBoard = false;
  //     this.resetBoard();
  //   }, 1000);
  // }

  // resetBoard() {
  //   [this.hasFlippedCard, this.lockBoard] = [false, false];
  //   [this.firstCard, this.secondCard] = [null, null];
  // }

  // shuffle() {
  //   this.cards.forEach(card => {
  //     const randomPos = Math.floor(Math.random() * 12);
  //     // card.style.order = randomPos;
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
}