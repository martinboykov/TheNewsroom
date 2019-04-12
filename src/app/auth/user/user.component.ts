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
    this.role = this.getUserRole(this.user);
  }
  logout() {
    this.authService.logout();
  }
  getUserRole(user) {
    if (user.roles.isAdmin === true) { return Role.Admin; }
    if (user.roles.isWriter === true) { return Role.Writer; }
    if (user.roles.isReader === true) { return Role.Reader; }
    return Role.None;
  }
}
