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
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }

  getPosts() {
    this.http
      .get<{ message: string, data: Post[] }>(BACKEND_URL + '/posts')
      .subscribe((postData) => {
        this.posts = postData.data;
        this.postUpdated.next([...this.posts]);
      })
    return [...this.posts];
  }
  getPostUpdateListener() { // as we set postUpdate as private
    return this.postUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
}
