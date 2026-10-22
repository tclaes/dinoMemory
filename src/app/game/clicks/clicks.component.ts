import {Component, inject} from '@angular/core';
import {GameService} from '../playfield/services/game.service';

@Component({
  selector: 'app-clicks',
  template: `
      <div id="clicks">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 4c1 2 1 4-1 6M18 4c-1 2-1 4 1 6M9 22c-1-3 0-6 3-6s4 3 3 6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"
                    fill="none"/>
              <circle cx="12" cy="13" r="2.4" fill="#fff"/>
          </svg>
          <span>{{ nrOfClicks() }} tries</span>
      </div>
  `,
  styleUrls: ['./clicks.component.scss'],
})
export class ClicksComponent {
  gameService = inject(GameService);
  nrOfClicks = this.gameService.clicked;
}
