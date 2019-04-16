import { Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { throttleTime, distinctUntilChanged } from 'rxjs/operators';
import { DeviceDetectorService } from 'ngx-device-detector';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable({
  providedIn: 'root'
})
export class WindowRef {
  private isMobileResolution: boolean;
  private is_400w_Required: boolean;
  private isMobileResolutionUpdated = new Subject<boolean>();
  private is_400w_RequiredUpdated = new Subject<boolean>();
  private subscribtionExists = false;

  deviceInfo = null;
  isDesktopDevice: boolean;
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
  get is_400w() {
    if (this.nativeWindow.innerWidth <= 400 || this.nativeWindow.innerWidth > 979) {
      return true;
    } else {
      return false;
    }
  }
  constructor(private deviceService: DeviceDetectorService) {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  checkIfMobile() {
    // if there a subscribtion somewhere active => continue without creating new one
    if (this.subscribtionExists) { return; }
    this.subscribtionExists = true;
    return fromEvent(this.nativeWindow, 'resize')
      .pipe(
        // throttleTime(100),
        // distinctUntilChanged(),
      )
      .subscribe((event) => {
        // intersectionObserver bug on resize (on mobile cousing aside closing on scroll)
        if (this.isDesktopDevice) { this.simulateScroll(); }

        // window width
        if (this.nativeWindow.innerWidth <= 979) {
          this.isMobileResolution = true;
        } else {
          this.isMobileResolution = false;
        }

        // images width and height
        if (this.nativeWindow.innerWidth <= 400 || this.nativeWindow.innerWidth > 979) {
          this.is_400w_Required = true;
        } else {
          this.is_400w_Required = false;
        }
        this.isMobileResolutionUpdated.next(this.isMobileResolution);
        this.is_400w_RequiredUpdated.next(this.is_400w_Required);
      });
  }

  scrollToTop(duration) {
    const window = this.nativeWindow;
    const scrollDuration = duration || 0;
    // set speed of scrolling if needed
    const scrollHeight = window.scrollY,
      scrollStep = Math.PI / (scrollDuration / 15),
      cosParameter = scrollHeight / 2;
    let scrollCount = 0;
    let scrollMargin;
    const scrollInterval = setInterval(function () {
      if (window.scrollY !== 0) {
        scrollCount = scrollCount + 1;
        scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
        window.scrollTo(0, (scrollHeight - scrollMargin));
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
    window.scrollTo(0, 0);
  }

  simulateScroll() {
    const window = this.nativeWindow;
    const scrollHeight = window.scrollY;
    const scrollwidht = window.scrollX;
    window.scrollTo(scrollwidht, (scrollHeight + 100));
    window.scrollTo(scrollwidht, (scrollHeight - 100));
  }

  checkIfMobileUpdateListener() { // as we set postUpdate as private
    return this.isMobileResolutionUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

  checkIs_400w_RequiredUpdateListener() { // as we set postUpdate as private
    return this.is_400w_RequiredUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

}
