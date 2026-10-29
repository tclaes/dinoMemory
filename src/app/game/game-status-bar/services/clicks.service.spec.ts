import {TestBed} from '@angular/core/testing';

import {ClicksService} from './clicks.service';
import {GlobalService} from '../../global/services/global.service';
import {beforeEach, describe, expect, it} from 'vitest';

describe('ClicksService', () => {
  let service: ClicksService;
  let globalService: GlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClicksService);
    globalService = TestBed.inject(GlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('clickCounter should increment on card click', async () => {
    service.increment()

    expect(service.countedClicks()).toEqual(1);
  })

  it('countedClicks should be 0 after the game is stopped', async () => {
    globalService.startGame()
    service.increment()
    expect(service.countedClicks()).toEqual(1);

    globalService.stopGame()
    expect(service.countedClicks()).toEqual(0);
  })
});
