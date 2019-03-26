import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SlackErrorLoggingService {

  constructor(private http: HttpClient, private injector: Injector) { }

  logError(message, stackTrace) {
     const router = this.injector.get(Router);
    const webHook = 'https://hooks.slack.com/services/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';
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
