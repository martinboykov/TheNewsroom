import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-not-found',
  template: '<div>404</div>',
})
export class NotFoundComponent implements OnInit {

  constructor(
    private router: Router,
    private notifier: NotificationService,
  ) { }

  ngOnInit() {
    this.router.navigate(['/'])
      .then(() => {
        this.notifier.showError('404', 'Page not found');
      });
  }

}
