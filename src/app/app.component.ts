import { Router, NavigationEnd } from '@angular/router';
import { SlackErrorLoggingService } from './error-handling/slack-logging.service';
import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';
declare let ga: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, public router: Router) { }
  ngOnInit() {
    // if token time of validity is not yet expired
    this.authService.autoAuthUser();

    // subscribe to router events and send page views to Google Analytics
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }
}
