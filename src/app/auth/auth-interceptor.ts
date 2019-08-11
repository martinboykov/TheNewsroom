import { map } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import { environment } from './../../environments/environment';
const SLACK_WEBHOOK = environment.SLACK_WEBHOOK;
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url === SLACK_WEBHOOK) { return next.handle(req); } // bypassing slack error logging service

    const authToken = this.authService.getToken();
    // creating copy to the request
    const authRequest = req.clone({
      // 1st Approach: setting the token in the url
      // params: req.params.set('auth', this.auth.getToken())

      // 2nd Approach: setting the token in the header
      // Bearer + authtoken (according a convention) / can be skipped (only authToken)
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    // shorthand : https://angular.io/guide/http#intercepting-requests-and-responses
    // const authRequest = req.clone({ setHeaders: { Authorization: authToken } });

    return next.handle(authRequest);
  }
}
