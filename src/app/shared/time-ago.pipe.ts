// time-ago-pipe by AndrewPoyntz (with window object injection modification)
// https://github.com/AndrewPoyntz/time-ago-pipe/blob/master/time-ago.pipe.ts

import { WindowRef } from './winref.service';
import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private timer: number;
  public window = this.winref.nativeWindow;
  constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone, private winref: WindowRef) { }
  transform(value: string) {
    this.removeTimer();
    const d = new Date(value);
    const now = new Date();
    const seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    // const timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;

    this.timer = this.ngZone.runOutsideAngular(() => {
      const window = this.window;
      if (typeof window !== 'undefined') {
        return window.setTimeout(() => {
          this.ngZone.run(() => {
            this.changeDetectorRef.markForCheck();
            // console.log('checked');
          });
        }, 1000); // updates every second (attempt to fix ExpressionChangedAfterItHasBeenCheckedError in detail.component)
        // }, timeToUpdate);
      }
      return null;
    });
    const minutes = Math.round(Math.abs(seconds / 60));
    const hours = Math.round(Math.abs(minutes / 60));
    const days = Math.round(Math.abs(hours / 24));
    const months = Math.round(Math.abs(days / 30.416));
    const years = Math.round(Math.abs(days / 365));
    if (Number.isNaN(seconds)) {
      return '';
    } else if (seconds <= 59) {
      return 'a few seconds ago';
    } else if (seconds <= 119) {
      return 'a minute ago';
    } else if (minutes <= 59) {
      return minutes + ' minutes ago';
    } else if (minutes <= 119) {
      return 'an hour ago';
    } else if (hours <= 23) {
      return hours + ' hours ago';
    } else if (hours <= 47) {
      return 'a day ago';
    } else if (days <= 30) {
      return days + ' days ago';
    } else if (days <= 59) {
      return 'a month ago';
    } else if (days <= 345) {
      return months + ' months ago';
    } else if (days <= 545) {
      return 'a year ago';
    } else { // (days > 545)
      return years + ' years ago';
    }
  }
  ngOnDestroy(): void {
    this.removeTimer();
  }
  private removeTimer() {
    if (this.timer) {
      this.window.clearTimeout(this.timer);
      this.timer = null;
    }
  }
  // private getSecondsUntilUpdate(seconds: number) {
  //   const min = 60;
  //   const hr = min * 60;
  //   const day = hr * 24;
  //   return 1;
  // if (seconds < min) { // less than 1 min, update every 2 secs
  //   return 1;
  // } else if (seconds < hr) { // less than an hour, update every 30 secs
  //   return 30;
  // } else if (seconds < day) { // less then a day, update every 5 mins
  //   return 300;
  // } else { // update every hour
  //   return 3600;
  // }
  // }
}
