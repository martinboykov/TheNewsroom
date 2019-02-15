import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment'
const BACKEND_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: any[] = []; // only part of the data for each Post
  private postUpdated = new Subject<any[]>();
  constructor(private http: HttpClient) { }

  getPosts(url: String) {
    // const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    console.log(url);

    return this.http
      .get<{ message: string, data: any}>(BACKEND_URL + url)
      .subscribe((postData) => {
        console.log(postData);
        this.posts = postData.data.posts;
        this.postUpdated.next([...this.posts]);
      })
    // return [...this.posts];
  }
  getPostUpdateListener() { // as we set postUpdate as private
    return this.postUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
}
