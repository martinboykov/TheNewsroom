import { SlackErrorLoggingService } from './error-handling/slack-logging.service';
import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private slackErrorLoggingService: SlackErrorLoggingService) { }
  ngOnInit() {
    // if token time of validity is not yet expired
    this.authService.autoAuthUser();

    // if slack is used for logging errors from users => get slack webhook
    // this.slackErrorLoggingService.getSlackWebHook();
  }


}
