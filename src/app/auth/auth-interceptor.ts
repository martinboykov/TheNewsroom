import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.authService.getToken();
    console.log(authToken);

    // creating copy to the request
    const authRequest = req.clone({
      // 1st Approach: setting the token in the url
      // params: req.params.set('auth', this.auth.getToken())

      // 2nd Approach: setting the token in the header
      // Bearer + authtoken (according a convention) / cn be skipped (only authToken)
      headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    });
    return next.handle(authRequest);
  }
}
