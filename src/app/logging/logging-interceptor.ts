import { NotificationService } from './notification.service';
import { finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor(private notifier: NotificationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;
    let responseLimiter: HttpErrorResponse;
    // extend server response observable with logging
    return next.handle(req)
      .pipe(
        tap(
          // Succeeds when there is a response; ignore other events
          event => ok = event instanceof HttpResponse ? 'succeeded' : '',
          // Operation failed; error is an HttpErrorResponse
          error => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 429) {
                responseLimiter = error;
              }
            }
            ok = 'failed';
          }
        ),
        // Log when response observable either completes or errors
        finalize(() => {
          if (ok === 'failed') {
            if (responseLimiter) {
              const endTime: any = new Date(responseLimiter.error.data.resetTime);
              const title = 'Reached your Rate Limit!';
              const message = `Too many request were made in short period of time.
              Website will become responsivene aggain on
              ${endTime.toLocaleString()}.`;
              const options = {
                disableTimeOut: true,
                closeButton: true,
                progressBar: true,
              };
              this.notifier.showWarning(message, title, options);
            }
          }
        })
      );
  }
}
