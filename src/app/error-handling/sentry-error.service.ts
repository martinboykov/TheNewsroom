import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
// const SENTRY_KEY = environment.SENTRY_KEY;
// import * as Sentry from '@sentry/browser'; // npm install --save @sentry/browser
// Sentry.init({
//   dsn: SENTRY_KEY
// });

@Injectable({
  providedIn: 'root'
})
export class SentryErrorLoggingService {
  constructor() { }
  logError(error) {
    // Sentry.captureException(error.originalError || error);
    // throw error;
  }
}
