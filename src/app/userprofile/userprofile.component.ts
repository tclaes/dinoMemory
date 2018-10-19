import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {

  userprofileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });


  constructor() { }

  ngOnInit() {
  }

  register() {
    const email = this.userprofileForm.value.email;
    const password = this.userprofileForm.value.password;
    console.log(this.userprofileForm.value.username);
  }

}
