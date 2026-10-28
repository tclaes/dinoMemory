import {inject, linkedSignal, Service} from '@angular/core';
import {GlobalService} from '../../global/services/global.service';

@Service()
export class ClicksService {
  #globalService = inject(GlobalService);
  #countedClicks = linkedSignal<boolean, number>({
    source: this.#globalService.gameStarted$,
    computation: (started, previous) => started && previous ? previous.value : 0
  });
  countedClicks = this.#countedClicks.asReadonly();

  increment() {
    this.#countedClicks.update(count => count + 1 )
  }
}
