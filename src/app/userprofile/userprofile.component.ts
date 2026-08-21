import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent {

  user: User;

  constructor(private authService: AuthService) {
    authService.User.subscribe(user => this.user = user);
  }

}
