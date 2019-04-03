import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../shared/notification.service';
import { Role } from '../admin/user-roles';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isAuthorized: boolean;

  constructor(
    private authService: AuthService,
    private notifier: NotificationService,
    private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    // const isAuth = this.authService.getIsAuth();
    const currentUser = this.authService.getUser();
    this.isAuthorized = false;
    // check if user is authenticated
    if (currentUser) {
      // check if route is restricted by role
      if (route.data.role) {
        switch (route.data.role) {
          case Role.Admin:
            if (currentUser.roles.isAdmin === true) { this.isAuthorized = true; }
            break;
          case Role.Writer:

            if (currentUser.roles.isWriter === true) { this.isAuthorized = true; }
            break;
          case Role.Reader:
            if (currentUser.roles.isReader === true) { this.isAuthorized = true; }
            break;
          default:
            this.isAuthorized = false;
        }
        if (this.isAuthorized) {
          return true;
        }
        this.notifier.showInfo('You dont have authorization for this route', 'Unauthorized attempt');
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    }
    this.notifier.showInfo('Please login first', 'Unauthenticated attempt');
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
