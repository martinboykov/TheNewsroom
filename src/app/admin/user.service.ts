import { AuthData } from './../auth/auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
const BACKEND_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userRoles = ['Admin', 'Writer', 'Reader', 'No Role'];
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }
  getUserRoles() {
    return this.userRoles;
  }
  getUsersByType(userType?) {
    let queryParams;
    if (!userType) { queryParams = `?userType=none`; }
    if (userType) { queryParams = `?userType=${userType}`; }
    const route = `/users`;
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + route + queryParams);
  }
  getUserById(id) {
    const route = `/users/${id}`;
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + route);
  }
  updateUser(user) {
    const route = `/users/${user._id}`;
    return this.http
      .put<{ message: string, data: any }>(BACKEND_URL + route, user)
      .subscribe((response) => {
        console.log(response.data);
        this.router.navigate(['admin']);
      });
  }

}
