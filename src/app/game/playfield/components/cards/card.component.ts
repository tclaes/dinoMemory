import { Component, computed, input, output } from "@angular/core";
import { NgOptimizedImage } from "@angular/common";
import { BoardCard } from "../../model/board";
import { Deck } from "../../model/deck";

const COVERS = [
  { bg: "var(--dd-blue-bright)", star: "var(--dd-yellow)" },
  { bg: "var(--dd-pink-bright)", star: "var(--dd-yellow)" },
  { bg: "var(--dd-yellow)", star: "var(--dd-pink-bright)" },
];

@Component({
  selector: "app-card",
  template: `
    @if (this.deck().imgURL) {
      <img
        ngSrc="assets/img/{{ imgUrl() }}/{{ card().name }}.svg"
        alt="{{ card() }}"
        class="front-face"
        width="150"
        height="150"
      />
    }
    <button
      class="back-face"
      aria-label="Flip card"
      [style.background]="cover().bg"
      (click)="flipCard()"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        class="cover-star"
      >
        <path
          d="M12 3l1.9 4.5L18.5 8l-3.5 3.3.9 5.2L12 14l-3.9 2.5.9-5.2L5.5 8l4.6-.5L12 3z"
          [attr.fill]="cover().star"
          stroke="#1B1233"
          stroke-width="1.4"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <span class="matched-badge" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 13l5 5L19 7"
          stroke="#1B1233"
          stroke-width="3.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  `,
  styleUrls: ["./card.component.scss"],
  imports: [NgOptimizedImage],
})
export class CardComponent {
  card = input<BoardCard>();
  deck = input.required<Deck>();

  imgUrl = computed(() => {
    return this.deck().imgURL;
  });
  cover = computed(() => COVERS[this.card().coverIndex % COVERS.length]);
  flip = output<string>();

  flipCard() {
    this.flip.emit(this.card().id);
  }
}
