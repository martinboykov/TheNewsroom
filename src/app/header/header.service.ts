import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ParamMap } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private routerParameters: ParamMap;
  private routerParametersUpdated = new Subject<ParamMap>();

  constructor(
    private http: HttpClient,
    private router: Router) { }

  setRouterParameters(paramMap: ParamMap) {
    this.routerParameters = paramMap;
    this.routerParametersUpdated.next(this.routerParameters);
  }

  getRouterParametersUpdateListener() { // as we set postUpdate as private
    return this.routerParametersUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

}
