import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from './../../environments/environment';
let SLACK_WEBHOOK = null;
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SlackErrorLoggingService {
  public logHistory = new Set();
  private slackWebHookListener = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private injector: Injector) { }

  getSlackWebHook() {
    const url = `/posts/slack`;
    this.http
      .get<{ message: string, data: string }>(BACKEND_URL + url)
      .subscribe((response) => {
        SLACK_WEBHOOK = response.data;
        this.slackWebHookListener.next(response.data);
      });
  }
  getSlackWebHookString() {
    return SLACK_WEBHOOK;
  }
  getSlackWebHookListener() {
    return this.slackWebHookListener.asObservable();
  }

  logError(message, stackTrace) {
    if (this.logHistory.has(message)) { return; }
    this.logHistory.add(message);
    if (this.logHistory.size > 50) {
      const arr = [...Array.from(this.logHistory)].slice(25);
      this.logHistory.clear();
      arr.forEach((a) => this.logHistory.add(a));
    }
    // console.log(this.logHistory.entries());
    const router = this.injector.get(Router);
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
    const headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    if (!SLACK_WEBHOOK) { return this.getSlackWebHook(); }
    this.http.request(
      'POST',
      SLACK_WEBHOOK,
      {
        'body': messageObj,
        'headers': headers,
        'responseType': 'text', // https://github.com/slackapi/node-slack-sdk/pull/480
      },
    ).subscribe();
  }
}
