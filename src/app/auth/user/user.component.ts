import { Role } from './../../admin/user-roles';
import { AuthData } from './../auth-data.model';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: AuthData;
  role = '';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    switch (this.user.roles) {
      case Role.Admin:
        if (this.user.roles.isAdmin === true) { this.role = Role.Admin; }
        break;
      case Role.Writer:

        if (this.user.roles.isWriter === true) { this.role = Role.Writer; }
        break;
      case Role.Reader:
        if (this.user.roles.isReader === true) { this.role = Role.Reader; }
        break;
      default:
      this.role = Role.None;
    }
  }
  logout() {
    this.authService.logout();
  }

}
