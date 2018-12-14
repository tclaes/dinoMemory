import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent {

  user$: Observable<firebase.User>;

  constructor(private authService: AuthService) {
    this.user$ = authService.User;
  }
}
