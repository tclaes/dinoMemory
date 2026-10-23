import {Component, inject} from '@angular/core';
import {GlobalService} from '../../../global/services/global.service';

@Component({
  selector: 'app-restart',
  imports: [],
  templateUrl: './restart.component.html',
  styleUrl: './restart.component.css',
})
export class RestartComponent {
  globalService = inject(GlobalService);

  restart() {
    this.globalService.stopGame()
  }

}
