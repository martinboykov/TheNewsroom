import { Post } from './post.model';
import { Subject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: any[] = []; // only part of the data for each Post
  private postsUpdated = new Subject<any[]>();
  private totalPostsCount: number;
  private totalPostsUpdated = new Subject<number>();
  constructor(private http: HttpClient) { }

  getPosts(url: String, postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    console.log(BACKEND_URL + url + queryParams);
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + url + queryParams)
      .subscribe((postData) => {
        console.log(postData);
        this.posts = postData.data;
        this.postsUpdated.next([...this.posts]);
      });
    // return [...this.posts];
  }

  getPostsUpdateListener() { // as we set postUpdate as private
    return this.postsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

  getTotalPostsCount(url: String) {
    console.log(`${BACKEND_URL}` + url + `/totalCount`);
    return this.http.get<{ message: string, data: number }>(`${BACKEND_URL}` + url + `/totalCount`)
      .subscribe((response) => {
        this.totalPostsCount = response.data;
        this.totalPostsUpdated.next(this.totalPostsCount);
      });
  }

  getTotalPostsUpdateListener() { // as we set postUpdate as private
    return this.totalPostsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
}
