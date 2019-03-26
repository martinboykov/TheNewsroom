import { Injectable } from '@angular/core';
// import * as Sentry from '@sentry/browser'; // npm install --save @sentry/browser
// Sentry.init({
//   dsn: 'https://eb0335757f04456dacb021e99bfb4d0c@sentry.io/1423127'
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
