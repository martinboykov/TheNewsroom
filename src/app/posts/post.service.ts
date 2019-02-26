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
  private post: Post; // only part of the data for each Post
  private posts: any[] = []; // only part of the data for each Post
  private postsUpdated = new Subject<any[]>();
  private postUpdated = new Subject<Post>();
  private totalPostsCount: number;
  private totalPostsUpdated = new Subject<number>();
  constructor(private http: HttpClient) { }

  getPosts(url: String, postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    console.log(BACKEND_URL + url + queryParams);
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + url + queryParams)
      // content substringing is done in the backend for now
      // .pipe(
      //   map((postData) => {
      //     return postData.data.map((post) => {
      //       let content = post.content;
      //       // const el = document.createElement('html');
      //       // el.innerHTML = content;
      //       // el.querySelector('.first-paragraph'); // Live NodeList of your anchor elements
      //       content = content.substring(0, 20);
      //       post.content = content;
      //       // console.log(post);
      //       return post;
      //     });
      //   })
      // )
      .subscribe((postData) => {
        this.posts = postData.data;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getTotalPostsCount(url: String) {
    console.log(`${BACKEND_URL}` + url + `/totalCount`);
    return this.http.get<{ message: string, data: number }>(`${BACKEND_URL}` + url + `/totalCount`)
      .subscribe((response) => {
        this.totalPostsCount = response.data;
        this.totalPostsUpdated.next(this.totalPostsCount);
      });
  }

  getPost(id: string) {
    const _id = id;
    const url = '/posts/post/';
    return this.http
      .get<{ message: string, data: Post }>(BACKEND_URL + url + _id)
      .subscribe((postData) => {
        this.post = postData.data;
        this.postUpdated.next(this.post);
      });
  }

  addPost(data) {
    this.http
      .post<{ message: string, post: Post }>(
        'http://localhost:3000/api/posts',
        data)
        .subscribe((responseData) => {
          console.log(responseData);
        });
  }

  getPostsUpdateListener() { // as we set postUpdate as private
    return this.postsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
  getPostUpdateListener() { // as we set postUpdate as private
    return this.postUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

  getTotalPostsUpdateListener() { // as we set postUpdate as private
    return this.totalPostsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
}
