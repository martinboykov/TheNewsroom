import { Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';

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
    if (this.nativeWindow.innerWidth < 980) {
      return true;
    } else {
      return false;
    }
  }

  constructor() { }

  checkIfMobile() {
    return fromEvent(this.nativeWindow, 'resize')
      .subscribe((event) => {
        // output new window width and height
        if (this.nativeWindow.innerWidth < 980) {
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
