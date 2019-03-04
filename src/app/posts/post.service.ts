import { Post } from './post.model';
import { Comment } from './comment.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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

  // for post-list
  private totalPostsCount: number;
  private postsUpdated = new Subject<any[]>();
  private postUpdated = new Subject<Post>();
  private totalPostsUpdated = new Subject<number>();

  // for aside-tripple
  private latestPosts: any[] = []; // only part of the data for each Post
  private latestPostsUpdated = new Subject<any>();
  private popularPosts: any[] = []; // only part of the data for each Post
  private popularPostsUpdated = new Subject<any>();


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

  getTotalPostsCount(subRoute: string) {
    const route = subRoute + `/totalCount`;
    return this.http.get<{ message: string, data: number }>(`${BACKEND_URL}` + route)
      .subscribe((response) => {
        this.totalPostsCount = response.data;
        this.totalPostsUpdated.next(this.totalPostsCount);
      });
  }

  getPost(id: string) {
    const _id = id;
    const route = '/posts/post/details/' + _id;
    return this.http
      .get<{ message: string, data: Post }>(BACKEND_URL + route)
      .pipe(
        map((response) => {
          return response.data;
        })
      );
    // .subscribe((response: any) => {
    //   const post = response.data;
    //   this.postUpdated.next(post);
    // });
  }

  getRelatedPosts(post: Post) {
    const _id = post._id;
    const route = `/posts/post/related/${_id}`;
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + route)
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  // for Aside-Tripple
  getlatestPosts() {
    const route = '/posts/latest';
    return this.http.get<{ message: string, data: any[] }>(`${BACKEND_URL}` + route)
      .subscribe((response) => {
        this.latestPosts = response.data;
        this.latestPostsUpdated.next(this.latestPosts);
      });
  }

  getPopularPosts() {
    const route = '/posts/popular';
    return this.http.get<{ message: string, data: any[] }>(`${BACKEND_URL}` + route)
      .subscribe((response) => {
        this.popularPosts = response.data;
        this.popularPostsUpdated.next(this.popularPosts);
      });
  }

  addComment(postId: string, author, content: string) {
    const route = '/posts/post/comments/' + postId;

    const newComment: Comment = {
      author: author,
      content: content,
      postId: postId,
    };

    // ADD COMMENT TYPE TODO:???!?!
    return this.http.put<{ message: string, data: Post }>(
      BACKEND_URL + route,
      newComment)
      .subscribe((response) => {
        console.log(response);
        const post = response.data;
        // method 1 Pesimistic updating: only after success
        // this.post.comments.push(comment);
        this.postUpdated.next(post);
      });
  }

  // fake service
  addPost(data) {
    const route = '/posts';
    this.http
      .post<{ message: string, post: Post }>(
        BACKEND_URL + route,
        data)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  getPostUpdateListener() { // as we set postUpdate as private
    return this.postUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
  getPostsUpdateListener() { // as we set postUpdate as private
    return this.postsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

  getTotalPostsUpdateListener() { // as we set postUpdate as private
    return this.totalPostsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
  getLatestPostsUpdateListener() { // as we set postUpdate as private
    return this.latestPostsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
  getPopularPostsUpdateListener() { // as we set postUpdate as private
    return this.popularPostsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
}
