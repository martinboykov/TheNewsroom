import { Router } from '@angular/router';
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
  private posts: Post[] = []; // only part of the data for each Post

  // for post-list
  private totalPostsCount: number;
  private postsUpdated = new Subject<any[]>();
  // private postUpdated = new Subject<Post>();
  private totalPostsUpdated = new Subject<number>();

  // for aside-tripple
  private latestPosts: any[] = []; // only part of the data for each Post
  private latestPostsUpdated = new Subject<any>();
  private popularPosts: any[] = []; // only part of the data for each Post
  private popularPostsUpdated = new Subject<any>();
  private commentedPosts: any[] = []; // only part of the data for each Post
  private commentedPostsUpdated = new Subject<any>();


  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getPosts(url: String, commentsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${commentsPerPage}&page=${currentPage}`;
    // console.log(BACKEND_URL + url + queryParams);
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

  getPostComments(url: String, commentsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${commentsPerPage}&page=${currentPage}`;
    // console.log(BACKEND_URL + url + queryParams);
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + url + queryParams);
  }

  getTotalPostsCount(subRoute: string) {
    const route = subRoute + `/totalCount`;
    return this.http.get<{ message: string, data: number }>(`${BACKEND_URL}` + route)
      .subscribe((response) => {
        this.totalPostsCount = response.data;
        this.totalPostsUpdated.next(this.totalPostsCount);
      });
  }

  getPost(id: string, commentsPerPage: number, currentPage: number) {
    const _id = id;
    const queryParams = `?pageSize=${commentsPerPage}&page=${currentPage}`;
    const route = `/posts/${_id}/details/${queryParams}`;
    return this.http
      .get<{ message: string, data: { post: Post, totalCommentsCount: number } }>(BACKEND_URL + route)
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

  // dafaultPaginater argument is added, so the Application can adopt pagesize as needed
  addComment(newComment, defaultPaginator) {
    const _id = newComment.postId;
    const pageSize = defaultPaginator.itemsPerPage;
    const page = defaultPaginator.currentPage;
    const queryParams = `?pageSize=${pageSize}&page=${page}`;
    const route = `/posts/${_id}/comments${queryParams}`;
    const comment: Comment = {
      author: newComment.author,
      content: newComment.content,
      postId: newComment.postId,
    };
    return this.http.put<{ message: string, data: { commentsFirstPage: Comment[], totalCommentsCount: number } }>(
      BACKEND_URL + route,
      comment);
  }

  getRelatedPosts(post: Post) {
    const _id = post._id;
    const route = `/posts/${_id}/related`;
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

  getCommentedPosts() {
    const route = '/posts/commented';
    return this.http.get<{ message: string, data: any[] }>(`${BACKEND_URL}` + route)
      .subscribe((response) => {
        this.commentedPosts = response.data;
        this.commentedPostsUpdated.next(this.commentedPosts);
      });
  }

  updatePopularity(_id: string) {
    const route = `/posts/${_id}/popularity`;
    return this.http.put<{ message: string, data: number }>(
      BACKEND_URL + route, {})
      .subscribe(() => { });
  }

  editPost(post) {
    const route = `/posts`;
    const postData = new FormData(); // as json cant include File Type data we switch to Formdata, which accepts text values and BLOB values
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('categoryName', post.categorie);
    if (post.subcategorie) { postData.append('subcategoryName', post.subcategorie); }
    postData.append('tags', JSON.stringify(post.tags));
    postData.append('image', post.image); // 'image is same as in the backend ->  "multer" -> upload.single('image')

    this.http
      .post<{ message: string, post: any }>(
        BACKEND_URL + route,
        postData)
      .subscribe((response) => {
        // console.log(response);
        const newPost = response.post;
        this.posts.push(newPost);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId) {
    const route = `/posts/`;
    return this.http
      .delete<{ message: string, post: any }>(BACKEND_URL + route + postId)
      .subscribe((response) => console.log(response.message));
  }

  getTagNames() {
    const route = `/tags?namesOnly=true`;
    return this.http
      .get<{ message: string, data: string[] }>(BACKEND_URL + route)
      .pipe(
        map((response) => {
          return response.data;
        })
      );
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
  getCommentedPostsUpdateListener() { // as we set postUpdate as private
    return this.commentedPostsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }
}
