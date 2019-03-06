// Created by MarcinMichalik (with window object injection modification)
// https://github.com/MarcinMichalik/ng-scrollTo

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { WindowRef } from './winref.service';

@Injectable({
  providedIn: 'root'
})
export class ScrollToService {

  constructor(private winref: WindowRef) { }

  public scrollTo(element: string | HTMLElement, duration: number = 1, offset: number = 0): Observable<any> {
    const subject: Subject<any> = new Subject<any>();
    if (typeof element === 'string') {
      const el = document.querySelector(element as string);
      this.scrollToElement(el as HTMLElement, duration, offset, subject);
    } else if (element instanceof HTMLElement) {
      this.scrollToElement(element, duration, offset, subject);
    } else {
      subject.error('I don\'t find element');
    }
    return subject;
  }

  private scrollToElement(el: HTMLElement, duration: number, offset: number, subject) {
    const window = this.winref.nativeWindow;
    if (el) {
      const viewportOffset = el.getBoundingClientRect();
      const offsetTop = viewportOffset.top + window.pageYOffset;
      this.doScrolling(offsetTop + offset, duration, subject);
    } else {
      subject.error('I don\'t find element');
    }
    return subject;
  }

  private doScrolling(elementY, duration, subject: Subject<any>) {
    const window = this.winref.nativeWindow;
    const startingY = window.pageYOffset;
    const diff = elementY - startingY;
    let start;

    window.requestAnimationFrame(function step(timestamp) {
      start = (!start) ? timestamp : start;

      const time = timestamp - start;
      const percent = Math.min(time / duration, 1);

      window.scrollTo(0, startingY + diff * percent);

      if (time < duration) {
        window.requestAnimationFrame(step);
        subject.next({});
      } else {
        subject.complete();
      }
    });
  }
}
