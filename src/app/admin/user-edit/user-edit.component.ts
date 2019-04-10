import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthData } from '../../auth/auth-data.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  _id = '';
  email = '';
  user: AuthData;
  loading = false;
  adminUsers: AuthData[] = [];
  adminUsersTotalCount: number;
  isUserAdmin = false;
  isUserLoaded = false;
  isAdminTotalCount = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userForm = new FormGroup({
      isAdmin: new FormControl(false),
      isWriter: new FormControl(false),
      isReader: new FormControl(false),
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this._id = params.get('_id');
      this.email = params.get('email');
      this.userService.getUserById(this._id)
        .subscribe((response) => {
          this.isUserLoaded = true;
          this.user = response.data;
          this.isUserAdmin = this.user.roles.isAdmin;
          // console.log(this.user);
          this.userForm.controls.isAdmin.setValue(this.user.roles.isAdmin);
          this.userForm.controls.isWriter.setValue(this.user.roles.isWriter);
          this.userForm.controls.isReader.setValue(this.user.roles.isReader);
        });
    });
    this.userService.getUsersByType('Admin').subscribe((response) => {
      this.isAdminTotalCount = true;
      this.adminUsers = response.data;
      this.adminUsersTotalCount = this.adminUsers.length;
      // console.log(this.adminUsers);
      // console.log(this.adminUsersTotalCount);
    });
    this.userForm.valueChanges.subscribe((data) => {

    });

  }
  get isAdmin() { return this.userForm.get('isAdmin'); }
  get isWriter() { return this.userForm.get('isWriter'); }
  get isReader() { return this.userForm.get('isReader'); }

  onSaveUser() {
    // console.log(this.userForm.value);


    this.user.roles = this.userForm.value;
    if (this.isUserAdmin && this.adminUsersTotalCount === 1) { // there must be at any time at least one admin
      this.user.roles.isAdmin = true;
      this.user.roles.isWriter = true;
      this.user.roles.isReader = true;
    }
    if (this.isAdmin.value === true) { // if the user is admin => he is writer and reader
      this.user.roles.isWriter = true;
      this.user.roles.isReader = true;
    }
    if (this.isWriter.value === true) { // if the user is writer => he is reader
      this.user.roles.isReader = true;
    }
    // console.log(this.user);
    this.userService.updateUser(this.user);
  }

}
