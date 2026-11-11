import {Component, inject} from '@angular/core';
import {GameService} from '../../../playfield/services/game.service';

/** Reopens the scoreboard after it was closed on a won game. */
@Component({
  selector: 'app-show-scores',
  styleUrl: './show-scores.component.scss',
  template: `
      @if (gameService.gameWon() && !gameService.scoreboardOpen()) {
          <button type="button" class="focusable" (click)="gameService.openScoreboard()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6"
                        stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Show scores
          </button>
      }
  `
})
export class ShowScoresComponent {
  gameService = inject(GameService);
}
