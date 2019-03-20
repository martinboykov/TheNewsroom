import { Router } from '@angular/router';
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
    private router: Router,
  ) { }

  getCategory(name) {
    const route = `/categories/${name}`;
    return this.http
      .get<{ message: string, data: Category }>(BACKEND_URL + route);
  }

  getCategoryPostsPartial(name) {
    const route = `/categories/${name}/posts/partial`;
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + route);
  }

  getCategoryPostsTotalCount(name) {
    const route = `/categories/${name}/posts/totalCount`;
    return this.http
      .get<{ message: string, data: number }>(BACKEND_URL + route);
  }

  getCategories() {
    // if (this.categorySubscribtionExists) {
    //   return console.log('exist');
    // }
    // this.categorySubscribtionExists = true;
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
  editCategory(category, mode) {
    console.log(category);

    if (mode === 'create') {
      const route = `/categories`;
      this.http
        .post<{ message: string, data: Category }>(
          BACKEND_URL + route,
          category)
        .subscribe((response) => {
          console.log(response);
          this.getCategories();
          this.router.navigateByUrl('admin');
        });
    }
    if (mode === 'update') {
      const _id = category._id;
      const route = `/categories/${_id}`;
      this.http
        .put<{ message: string, data: Category }>(
          BACKEND_URL + route,
          category)
        .subscribe((response) => {
          console.log(response);
          this.getCategories();
          this.router.navigateByUrl('admin');
        });
    }
  }

  deleteCategory(category) {
    const route = `/categories/${category._id}`;
    return this.http
      .delete<{ message: string, data: Category }>(BACKEND_URL + route)
      .subscribe(() => {
        this.getCategories();
        this.router.navigateByUrl('admin');
      });
  }

  getCategoriesUpdateListener() { // as we set postUpdate as private
    return this.categoriesUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
}
