import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from './../../environments/environment';
const SLACK_WEBHOOK = environment.SLACK_WEBHOOK;

@Injectable({
  providedIn: 'root'
})
export class SlackErrorLoggingService {
  public logHistory = new Set();

  constructor(private http: HttpClient, private injector: Injector) { }

  logError(message, stackTrace) {
    if (this.logHistory.has(message)) { return; }
    this.logHistory.add(message);
    if (this.logHistory.size > 50) {
      const arr = [...Array.from(this.logHistory)].slice(25);
      this.logHistory.clear();
      arr.forEach((a) => this.logHistory.add(a));
    }
    console.log(this.logHistory.entries());
    const router = this.injector.get(Router);
    const webHook = SLACK_WEBHOOK;
    const messageObj = {
      channel: '#thenewsroom',
      text: message, // error.message
      attachments: [
        {
          // author_name: window.location.href,
          author_name: router.url,
          color: 'danger',
          title: 'Error Stack Trace',
          text: stackTrace // error.stack
        }
      ]
    };
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),

    };
    // this.http.post(webHook, messageObj, options).subscribe((response) => {
    // console.log(response);
    // });
    // const payload = JSON.stringify({ "text": "Hihi", });
    const headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    this.http.request(
      'POST',
      webHook,
      {
        'body': messageObj,
        'headers': headers,
        'responseType': 'text', // https://github.com/slackapi/node-slack-sdk/pull/480
      },

    ).subscribe();
  }
}
