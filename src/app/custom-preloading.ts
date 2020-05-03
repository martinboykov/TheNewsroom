import { of, Observable } from 'rxjs';
import { PreloadingStrategy, Route } from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class CustomPreloading implements PreloadingStrategy {
  preload(route: Route, preload: Function) {
    if (route.data && route.data.preload) {
      return preload();
    } else {
      return of(null);
    }
  }
}
