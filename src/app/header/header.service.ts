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
  // private categories: any[] = [];
  // private categoriesUpdated = new BehaviorSubject<any[]>([...this.categories]);
  // private categorySubscribtionExists = false;
  constructor(
    private http: HttpClient,
    private router: Router) { }

  // getCategories() {
  //   if (this.categorySubscribtionExists) {
  //     return console.log('exist');
  //   }
  //   this.categorySubscribtionExists = true;
  //   return this.http
  //     .get<{ message: string, data: any }>(BACKEND_URL + '/categories')
  //     .subscribe((response) => {
  //       this.categories = response.data;
  //       this.categoriesUpdated.next([...this.categories]);
  //     });
  // }

  // getCategoriesUpdateListener() { // as we set postUpdate as private
  //   return this.categoriesUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  // }


  setRouterParameters(paramMap: ParamMap) {
    this.routerParameters = paramMap;
    this.routerParametersUpdated.next(this.routerParameters);
  }

  getRouterParametersUpdateListener() { // as we set postUpdate as private
    return this.routerParametersUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

}
