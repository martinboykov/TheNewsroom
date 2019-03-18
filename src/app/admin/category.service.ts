import { Category } from './category.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [];
  private categoriesUpdated = new BehaviorSubject<any[]>([...this.categories]);
  private categorySubscribtionExists = false;
  constructor(
    private http: HttpClient,
  ) { }

  getCategories() {
    if (this.categorySubscribtionExists) {
      return console.log('exist');
    }
    this.categorySubscribtionExists = true;
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + '/categories')
      .subscribe((response) => {
        this.categories = response.data;
        this.categoriesUpdated.next([...this.categories]);
      });
  }
  getCategoriesFull() {
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + '/categories/full')
      .pipe(
        map((response) => response.data)
      );
  }

  getCategoriesUpdateListener() { // as we set postUpdate as private
    return this.categoriesUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
}
