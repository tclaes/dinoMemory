import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'app-main',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class AppComponent {}
