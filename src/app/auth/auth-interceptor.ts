import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

import { environment } from './../../environments/environment';
import { SlackErrorLoggingService } from '../error-handling/slack-logging.service';
let SLACK_WEBHOOK = null;
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private slackErrorLoggingService: SlackErrorLoggingService) {
    this.slackErrorLoggingService.getSlackWebHookListener().subscribe((data) => {
      SLACK_WEBHOOK = data;
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // const SLACK_WEBHOOK = this.slackErrorLoggingService.getSlackWebHookString();
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
    return next.handle(authRequest);
  }
}
