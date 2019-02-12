import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Category } from './category.model';
import { environment } from '../../environments/environment'
const BACKEND_URL = environment.apiUrl + '/';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private categories: any[] = [];
  private categoriesUpdated = new Subject<any[]>();
  constructor(
    private http: HttpClient,
    private router: Router, ) { }

  getCategories() {
    this.http
      .get<{ message: string, data: any }>(BACKEND_URL + 'categories')
      .subscribe((response)=>{
        this.categories = response.data;
        this.categoriesUpdated.next([...this.categories]);
      })
  }
  getCategoriesUpdateListener() { // as we set postUpdate as private
    return this.categoriesUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

}
