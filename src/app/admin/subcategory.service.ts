import { CategoryService } from './category.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Subcategory } from './subcategory.model';
import { NotificationService } from '../logging/notification.service';
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private categoryService: CategoryService,
    private notifier: NotificationService,
  ) { }

  getSubcategory(name) {
    const route = `/subcategories/${name}`;
    return this.http
      .get<{ message: string, data: Subcategory }>(BACKEND_URL + route);
  }

  getSubcategoryPosts(name) {
    const route = `/subcategories/${name}/posts/partial`;
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + route);
  }

  getSubcategoryPostsTotalCount(name) {
    const route = `/subcategories/${name}/posts/totalCount`;
    return this.http
      .get<{ message: string, data: number }>(BACKEND_URL + route);
  }

  editSubcategory(subcategory, options) {
    let route;
    if (options.mode === 'create') {
      route = `/subcategories`;
      return this.http
        .post<{ message: string, data: Subcategory }>(
          BACKEND_URL + route,
          subcategory);
    }
    if (options.mode === 'update') {
      const _id = options._id;
      route = `/subcategories/${_id}`;
      return this.http
        .put<{ message: string, data: Subcategory }>(
          BACKEND_URL + route,
          subcategory);
    }

  }


  deleteSubcategory(subcategory) {
    const route = `/subcategories/${subcategory._id}`;
    return this.http
      .delete<{ message: string, post: Subcategory }>(BACKEND_URL + route)
      .subscribe(() => {
        this.categoryService.getCategories();
        this.notifier.showSuccess('Subcategory was deleted successfully');
        this.router.navigateByUrl('/admin');
      });
  }
}
