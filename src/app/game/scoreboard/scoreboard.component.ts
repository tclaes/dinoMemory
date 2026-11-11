import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {GameService} from '../playfield/services/game.service';
import {Score, ScoreService} from './score.service';
import {ClicksService} from '../game-status-bar/services/clicks.service';
import {GlobalService} from '../global/services/global.service';
import {TimerService} from '../game-status-bar/services/timer.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {DurationPipe} from '../game-status-bar/format/duration.pipe';
import {closeTopLayer, isOutsideDialog, lacksClosedBy, supportsTopLayerExit} from './top-layer';

@Component({
  selector: 'app-scoreboard',
  encapsulation: ViewEncapsulation.None,
  template: `
      <dialog #dialog class="scoreboard-dialog" closedby="any" aria-labelledby="scoreboard-title"
              (close)="gameService.closeScoreboard()" (cancel)="onCancel($event)"
              (pointerdown)="onPointerDown($event)" (pointerup)="onPointerUp($event)">
          <header class="scoreboard-header">
              <svg class="scoreboard-trophy" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <h2 id="scoreboard-title">{{ title() }}</h2>
              <button type="button" class="scoreboard-close" aria-label="Close scoreboard" (click)="close()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
                  </svg>
              </button>
          </header>
          <p class="scoreboard-summary">{{ nrOfClicks() }} tries in {{ elapsedMs() | duration }}</p>

          <table mat-table [dataSource]="scores()">
              <ng-container matColumnDef="user">
                  <th mat-header-cell *matHeaderCellDef> User</th>
                  <td mat-cell *matCellDef="let score"> {{ score.user }}</td>
              </ng-container>
              <ng-container matColumnDef="clicks">
                  <th mat-header-cell *matHeaderCellDef> Clicks</th>
                  <td mat-cell *matCellDef="let score"> {{ score.clicks }}</td>
              </ng-container>
              <ng-container matColumnDef="time">
                  <th mat-header-cell *matHeaderCellDef> Time</th>
                  <td mat-cell *matCellDef="let score"> {{ score.durationMs | duration }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns; let i = index"
                  [class.mine]="i === ownIndex()" [attr.aria-current]="i === ownIndex() ? 'true' : null"></tr>
          </table>
          <button id="won" class="button" autofocus (click)="newGame()" mat-stroked-button>New game?</button>
      </dialog>
  `,
  styleUrls: ['./scoreboard.component.scss'],
  imports: [
    DurationPipe,
    MatRow,
    MatHeaderRow,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatRowDef,
    MatButton,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatTable
  ]
})
export class ScoreboardComponent implements OnInit {
  gameService = inject(GameService);
  scores = signal<Score[]>([]);
  displayedColumns: string[] = ['user', 'clicks', 'time'];
  #clicksService = inject(ClicksService);
  #destroyRef = inject(DestroyRef);
  #globalService = inject(GlobalService);
  nrOfClicks = this.#clicksService.countedClicks;
  #scoreService = inject(ScoreService);
  #timerService = inject(TimerService);
  elapsedMs = this.#timerService.elapsedMs;
  dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  /** Position of the score of the game just won in the shown top 10, or -1 when it is not listed. */
  ownIndex = computed(() => {
    const user = this.gameService.user();
    if (!user) {
      return -1;
    }
    return this.scores().findIndex(score => score.user === user.displayName
      && score.clicks === this.nrOfClicks() && score.durationMs === this.elapsedMs());
  });
  title = computed(() => this.ownIndex() >= 0 ? `You're #${this.ownIndex() + 1}` : 'Game won');
  #pressedOutside = false;

  constructor() {
    effect(() => {
      const open = this.gameService.scoreboardOpen();
      const dialog = this.dialog()?.nativeElement;
      if (!dialog) {
        return;
      }
      untracked(() => {
        if (open && !dialog.open) {
          dialog.showModal();
        } else if (!open && dialog.open) {
          void closeTopLayer(dialog);
        }
      });
    });
  }

  newGame() {
    this.#globalService.stopGame();
  }

  close() {
    void closeTopLayer(this.dialog().nativeElement);
  }

  // Esc and light dismiss close the dialog natively; where the exit cannot animate, close it by hand.
  onCancel(event: Event) {
    if (!supportsTopLayerExit()) {
      event.preventDefault();
      this.close();
    }
  }

  onPointerDown(event: PointerEvent) {
    this.#pressedOutside = lacksClosedBy() && isOutsideDialog(event, this.dialog().nativeElement);
  }

  // Both press and release must be outside, so a text selection that ends on the backdrop does not dismiss.
  onPointerUp(event: PointerEvent) {
    if (this.#pressedOutside && isOutsideDialog(event, this.dialog().nativeElement)) {
      this.close();
    }
    this.#pressedOutside = false;
  }

  ngOnInit() {
    const deck = this.gameService.deck()?.name;
    const user = this.gameService.user();
    if (user && !this.gameService.scoreSaved()) {
      this.#scoreService.updateScores(user.displayName, this.nrOfClicks(), this.elapsedMs(), deck);
      this.gameService.markScoreSaved();
    }
    this.#scoreService.loadScores(deck)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(scores => this.scores.set(scores));
  }
}
