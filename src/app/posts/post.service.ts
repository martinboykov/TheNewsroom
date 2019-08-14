import { WindowRef } from './../shared/winref.service';
import { CategoryService } from './../admin/category.service';
import { HelperService } from './../shared/helper.service';
import { Router } from '@angular/router';
import { Post } from './post.model';
import { Comment } from './comment.model';
import { Subject, of, concat } from 'rxjs';
import { map, concatMap, delay, repeat } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { NotificationService } from '../logging/notification.service';
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
  private totalPostsUpdated = new Subject<number>();

  // for details
  private currentPost: any;
  private currentPostUpdated = new Subject<any>();
  private relatedPosts: any[] = []; // only part of the data for each Post
  private relatedPostsUpdated = new Subject<any>();

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
    private helper: HelperService,
    private notifier: NotificationService,
    private categoryService: CategoryService,
    private windowRef: WindowRef,
  ) { }

  getPosts(url: String, commentsPerPage: number, currentPage: number) {
    const pageSize = commentsPerPage;
    const page = currentPage;
    const queryParams = `?pageSize=${pageSize}&page=${page}`;
    return this.http
      .get<{ message: string, data: { posts: Post[], totalPostsCount: number } }>(BACKEND_URL + url + queryParams)
      .subscribe((postData) => {
        this.posts = postData.data.posts;
        this.postsUpdated.next([...this.posts]);
        this.totalPostsCount = postData.data.totalPostsCount;
        this.totalPostsUpdated.next(this.totalPostsCount);
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

  getPost(id: string, commentsPerPage?: number, currentPage?: number) {
    const _id = id;
    const pageSize = commentsPerPage || 10;
    const page = currentPage || 1;
    const queryParams = `?pageSize=${pageSize}&page=${page}`;
    const route = `/posts/${_id}/details/${queryParams}`;
    return this.http
      .get<{ message: string, data: { post: Post, totalCommentsCount: number } }>(BACKEND_URL + route)
      .pipe(
        map((response) => {
          return response.data;
        })
      )
      .subscribe((data: any) => {
        this.currentPost = data;
        this.currentPostUpdated.next(this.currentPost);
      });
  }

  getPostComments(url: String, commentsPerPage: number, currentPage: number) {
    const pageSize = commentsPerPage;
    const page = currentPage;
    const queryParams = `?pageSize=${pageSize}&page=${page}`;
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + url + queryParams);
  }

  getRelatedPosts(_id: string) {
    const route = `/posts/${_id}/related`;
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + route)
      .pipe(
        map((response) => {
          return response.data;
        })
      ).subscribe((data) => {
        this.relatedPosts = data;
        this.relatedPostsUpdated.next(this.relatedPosts);
      });
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

  updatePopularity(_id: string) {
    const route = `/posts/${_id}/popularity`;
    return this.http.put<{ message: string, data: number }>(
      BACKEND_URL + route, {})
      .subscribe();
  }

  editPost(post, mode: string) {
    const postData = new FormData(); // as json cant include File Type data we switch to Formdata, which accepts text values and BLOB values
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('categoryName', post.category);
    if (post.subcategory) { postData.append('subcategoryName', post.subcategory); }
    postData.append('tags', JSON.stringify(post.tags));
    postData.append('imageMainPath', post.image); // 'imageMainPath is same as in the backend ->  "multer" -> upload.single('image')
    if (mode === 'create') {
      const route = `/posts`;
      return this.http
        .post<{ message: string, data: any }>(
          BACKEND_URL + route,
          postData)
        .subscribe((response) => {
          // const newPost = response.data;
          // this.posts.push(newPost);
          // this.postsUpdated.next([...this.posts]);
          this.getlatestPosts();
          this.notifier.showSuccess('Post was created successfully');
          this.windowRef.scrollToTop(0);
          this.router.navigate(['/']);
        });
    }
    if (mode === 'update') {
      const route = `/posts/${post._id}`;
      return this.http
        .put<{ message: string, data: Post }>(
          BACKEND_URL + route,
          postData)
        .subscribe((response) => {
          const newPost = response.data;
          // this.posts.push(newPost);
          // this.postsUpdated.next([...this.posts]);
          this.notifier.showSuccess('Post was updated successfully');
          const postLink = this.helper.createRoute(newPost);
          this.windowRef.scrollToTop(0);
          this.router.navigateByUrl(postLink);
        });
    }
  }

  deletePost(post) {
    const route = `/posts/`;
    return this.http
      .delete<{ message: string, post: any }>(BACKEND_URL + route + post._id)
      .subscribe(() => {
        this.getlatestPosts();
        this.getPopularPosts();
        this.getCommentedPosts();
        this.notifier.showSuccess('Post was deleted successfully');
        this.windowRef.scrollToTop(0);
        this.router.navigateByUrl('/');
      });
  }

  getTagNames(name?) {
    let route;

    route = `/tags?namesOnly=true&name=${name}`;
    return this.http
      .get<{ message: string, data: string[] }>(BACKEND_URL + route)
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  getCategories() {
    return this.http
      .get<{ message: string, data: any }>(BACKEND_URL + '/categories')
      .pipe(
        map((response) => {
          return response.data;
        })
      );
  }

  getCurrentPostUpdateListener() { // as we set postUpdate as private
    return this.currentPostUpdated.asObservable(); // returns object to which we can listen, but we cant emit
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
  getRelatedPostsUpdateListener() { // as we set postUpdate as private
    return this.relatedPostsUpdated.asObservable(); // returns object to which we can listen, but we cant emit
  }

  // Mock survice
  // mongodb Mock posts loading
  // -------------------------
  //   addMockPost(counter, options) {
  //     let post;
  //     const category = options.category;
  //     const subcategory = options.subcategory;
  //     const imageUrl = options.imageUrl;
  //     post = {
  //       content: `<div>Mock content ${counter}.
  //           Moutain bike is awesome&nbsp;Cras sit amet lorem sit amet sem finibus convallis. Aliquam sed ante volutpat, vehicula mi ut,
  //     luctus velit.Sed erat sem, accumsan in quam nec, iaculis posuere nisi. Aliquam varius mattis ante eget sodales.Donec rhoncus, quam
  //     eu aliquet varius, dolor orci ullamcorper nisi, id aliquam purus augue id arcu.Donec blandit pharetra dictum. Duis arcu est,
  //     auctor eget lacinia et, interdum et metus.Nullam ullamcorper lorem odio, sed ultrices odio maximus a. Curabitur molestie,
  //     urna sed pellentesque pulvinar,dui tortor dictum orci, eu semper lacus erat sit amet tortor.</div>
  // <div><br></div>
  // <div>Integer vitae mauris egestas est gravida mollis. Nulla vel convallis ex.
  // Vestibulum id lacus quis nisi pellentesque ultricies sed id nisl.Sed elit mauris,
  // blandit nec nunc cursus, sollicitudin tristique tellus. Morbi pellentesque nunc ac tincidunt fermentum.Ut
  //     aliquam lacus ut lobortis auctor. Sed condimentum, urna vitae sagittis interdum, nulla lacus laoreet massa,
  //     non dignissim purus elit eu lectus. Etiam nulla est, consectetur et pharetra non, ultricies nec massa.
  //     Duis consectetur risus a interdum venenatis. Nullam ut magna nec elit convallis tempus tristique quis nunc.
  //     Vivamus et molestie velit. Aliquam eleifend,arcu ac condimentum mattis, nisi lectus vestibulum eros,
  //      sit amet sagittis tortor ipsum sed lorem.Fusce sit amet malesuada metus. Sed sit amet sapien
  //     condimentum, scelerisque libero a, sodales lorem.Integer malesuada volutpat justo,
  //      sit amet vulputate lorem condimentum at. In suscipit mauris non mauris laoreet luctus.</div>
  // <div><br></div>
  // <div>Phasellus lectus ligula, ullamcorper a est eu, imperdiet euismod sapien. Sed maximus,
  // diam vitae blandit tincidunt,justo ligula fringilla turpis, eget faucibus erat nibh non elit.
  // Proin nec malesuada ipsum. Maecenas pretium felis vulputate,sollicitudin
  //     metus eu, semper sem. Sed a sem posuere, rhoncus dui nec, vulputate arcu. Cras eget porta nisl.
  //     Sed luctus dui sed ligula fermentum, ut mattis nisl pharetra.Ut pellentesque odio ac vulputate ornare. Etiam vel suscipit velit.
  //     Cras in euismod nunc. Fusce accumsan nunc enim,eu dapibus lacus malesuada sed. Maecenas ullamcorper condimentum ligula,
  //     vitae molestie diam rhoncus faucibus.Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
  //     Donec eget arcu mi.Ut lacinia tortor in eros bibendum, tempor ultricies odio dignissim.
  //     Aenean venenatis lorem gravida vestibulum ullamcorper. Nam vel metus nec lorem gravida blandit in a justo.
  //      Nam et consectetur est.In hac habitasse platea dictumst. Phasellus volutpat felis congue cursus aliquet.
  //      Pellentesque ex nibh,venenatis non sapien nec, rhoncus interdum ipsum.</div>`,
  //       category: category,
  //       image: imageUrl,
  //     };
  //     if (subcategory) {
  //       post.title = `Mock ${category} title ${counter} about ${subcategory}`;
  //       post.subcategory = subcategory;
  //       post.tags = [`${subcategory} ${counter}`, `${subcategory}`];
  //     } else {
  //       post.title = `Mock ${category} title ${counter}`;
  //       post.tags = [`${category} ${counter}`, `${category}`];
  //     }
  //     console.log(post);
  //     this.editPost(post, 'create');
  //   }

  // addMockPosts() {
  //   let nextPostCount = null;
  //   const route = `/posts/totalCount`;
  //   const task = this.http.get<{ message: string, data: number }>(`${BACKEND_URL}` + route)
  //     .pipe(delay(100),
  //       concatMap((postsCount) => {
  //         nextPostCount = postsCount.data + 1;
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'bulgaria',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564819156418_rila-lakes.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'world',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564823551794_donald-trump-putin-meeting-gq.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'sport', subcategory: 'football',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1554814323954_lionel-messi.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'sport', subcategory: 'basketball',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1563541767492_20190530-kawhi-leonard.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'sport', subcategory: 'tennis',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1554814358520_tennis.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'entertainment', subcategory: 'movies',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1554811450864_thematrix1999.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'entertainment', subcategory: 'music',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1554818986842_u2.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'entertainment', subcategory: 'tv',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1554818901323_truedetective.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'technology', subcategory: 'smartphones',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1554811430909_smartphone.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'technology', subcategory: 'cars',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1554811395034_teslamodel3.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'bulgaria',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564820059919_sofia-bulgaria-sveta-sofia.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'world',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564823898378_china-us-container-war.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'sport', subcategory: 'football',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564821858266_ronaldo.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'sport', subcategory: 'basketball',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564821069459_kawhi-leonard-gp-clippers.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'sport', subcategory: 'tennis',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564822971994_rogerfederer.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'entertainment', subcategory: 'movies',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564849588587_pulp-fiction.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'entertainment', subcategory: 'music',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564824737557_queen.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'entertainment', subcategory: 'tv',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564824329978_breaking-bad.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'technology', subcategory: 'smartphones',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564825602473_huawei-usa-ban.jpeg'
  //         }));
  //       })
  //     )
  //     .pipe(delay(100),
  //       concatMap(() => {
  //         return of(this.addMockPost(nextPostCount++, {
  //           category: 'technology', subcategory: 'cars',
  //           imageUrl: 'https://storage.googleapis.com/thenewsroom-images-storage-bucket/1564825966221_roadster-social.jpeg'
  //         }));
  //       })
  //     );
  //   const count = 20;
  //   let remain = count;
  //   task.pipe(repeat(count), delay(2000)).subscribe(() => {
  //     console.log('Done with task - ' + remain);
  //     remain -= 1;
  //   });
  // }
}
