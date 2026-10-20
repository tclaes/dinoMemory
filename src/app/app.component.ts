import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavigationComponent} from './nav/navigation/navigation.component';

@Component({
    selector: 'app-main',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet, NavigationComponent]
})

export class AppComponent {}
