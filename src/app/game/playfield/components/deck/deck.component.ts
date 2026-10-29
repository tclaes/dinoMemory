import { Component, DestroyRef, ElementRef, computed, inject, signal } from "@angular/core";
import { GameService } from "../../services/game.service";
import { CardComponent } from "../cards/card.component";
import { bestGrid } from "./best-grid";

@Component({
  selector: "app-deck",
  imports: [CardComponent],
  templateUrl: "./deck.component.html",
  styleUrl: "./deck.component.css",
  host: {
    "[style.--grid-columns]": "grid().columns",
    "[style.--grid-rows]": "grid().rows",
  },
})
export class DeckComponent {
  gameService = inject(GameService);
  board = this.gameService.board;
  deck = this.gameService.deck;

  #host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  #size = signal({ width: 0, height: 0, gap: 0 });

  grid = computed(() => {
    const { width, height, gap } = this.#size();
    return bestGrid(this.board().length, width, height, gap);
  });

  constructor() {
    const observer = new ResizeObserver(([entry]) => {
      const { inlineSize, blockSize } = entry.contentBoxSize[0];
      const gap = parseFloat(getComputedStyle(this.#host).columnGap) || 0;
      this.#size.set({ width: inlineSize, height: blockSize, gap });
    });

    observer.observe(this.#host);
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }

  flipCard(id: string) {
    this.gameService.flipCard(id);
  }
}
