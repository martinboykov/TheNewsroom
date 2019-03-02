import { Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRef {
  private isMobileResolution: boolean;
  private isMobileResolutionUpdated = new Subject<boolean>();

  get nativeWindow(): any {
    return _window();
  }
  get isMobile() {
    if (this.nativeWindow.innerWidth <= 979) { // on firefox native.innerWidth is bugged at 980 (skips 981)
      return true;
    } else {
      return false;
    }
  }

  constructor() { }

  checkIfMobile() {
    return fromEvent(this.nativeWindow, 'resize')
      .pipe(
        throttleTime(100),
      )
      .subscribe((event) => {
        console.log(this.nativeWindow.innerWidth);

        // output new window width and height
        if (this.nativeWindow.innerWidth <= 979) {
          this.isMobileResolution = true;
        } else {
          this.isMobileResolution = false;
        }
        this.isMobileResolutionUpdated.next(this.isMobileResolution);
      });
  }
  checkIfMobileUpdateListener() { // as we set postUpdate as private
    return this.isMobileResolutionUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

}
