import { WindowRef } from './../../shared/winref.service';
import { Post } from './../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HeaderService } from './../../header/header.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../post.service';
import { PaginationInstance } from 'ngx-pagination';
import { throttleTime } from 'rxjs/operators';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // Routing
  routerParameters: ParamMap;
  routerParametersSubscription: Subscription;
  isAsideRequired = true; // for mobile only at home route

  // Posts
  url: string;
  posts: Post[]; // strict Post model !?!
  private postsSubscription: Subscription;
  private totalPostsSubscription: Subscription;

  // Pagination
  postsPagination: Post[];
  isPaginationRequired: boolean;
  config: PaginationInstance = {
    id: 'paginator',
    itemsPerPage: 15,
    currentPage: 1,
    totalItems: 0,
  };
  labels: any = {
    previousLabel: '',
    nextLabel: '',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'Page',
    screenReaderCurrentLabel: `You're on page`
  };

  // Scroller
  postsScroller: Post[];
  currentPageScroller = 1;
  itemsPerScroll = 30;
  throttle = 750;
  scrollDistance = 3;
  // scrollUpDistance = 2;

  // windowReference;
  isMobileResolution: boolean;
  private isMobileResolutionSubscription: Subscription;

  constructor(private headerService: HeaderService,
    private postService: PostService,
    private windowRef: WindowRef,
    public route: ActivatedRoute) {
  }

  ngOnInit() {
    // subscribe to changing routes => to fetch corresponding recourses
    this.route.paramMap.subscribe((params: ParamMap) => {
      // reset on route change
      this.config.currentPage = 1;
      this.currentPageScroller = 1;
      this.config.totalItems = 0;
      this.posts = [];
      this.postsPagination = [];
      this.postsScroller = [];
      this.headerService.setRouterParameters(params);
      this.url = this.getUrl(params);
      console.log(this.url);

      this.postService.getTotalPostsCount(this.url);
      this.postService.getPosts(this.url, this.itemsPerScroll, this.currentPageScroller);
    });

    this.postsSubscription = this.postService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        if (this.postsPagination.length === 0 || !this.isMobileResolution) {
          this.postsPagination = posts.slice(0, this.config.itemsPerPage);
        }
        if (this.postsScroller.length === 0 || this.isMobileResolution) {
          this.postsScroller = [...this.postsScroller, ...posts];
          console.log(`postsScroller.length = ` + this.postsScroller.length);
        }
      });

    this.totalPostsSubscription = this.postService.getTotalPostsUpdateListener()
      .subscribe((totalCount: number) => {
        console.log('TOTAL POST COUNT =  ' + totalCount);

        this.config.totalItems = totalCount;
        this.isPaginationRequired = this.showIfPaginationRequired(this.config.itemsPerPage, totalCount);
      });


    // detect if Moobile resolution < 979px width
    this.isMobileResolution = this.windowRef.isMobile;
    this.windowRef.checkIfMobile();
    this.isMobileResolutionSubscription = this.windowRef.checkIfMobileUpdateListener()
      // .pipe(
      //   throttleTime(100),
      //   // tap((isMobile) => {
      //   //   console.log(isMobile);
      //   //   this.isMobileResolution = isMobile;
      //   // }),
      // )
      .subscribe((isMobile) => {
        this.isMobileResolution = isMobile;
      });
  }

  // SCROLLER
  fetchMoreEnd() {
    console.log('scroll end');
    console.log(`postsScroller.length = ` + this.postsScroller.length);
    if (this.postsScroller.length >= this.config.totalItems) {
      return;
    }
    this.currentPageScroller += 1;
    return this.postService.getPosts(this.url, this.itemsPerScroll, this.currentPageScroller);
  }

  // PAGINATION
  onChangedPage(page: number) {
    this.config.currentPage = page;
    return this.postService.getPosts(this.url, this.config.itemsPerPage, this.config.currentPage);
  }

  getUrl(params) {
    let url = '/posts';
    const category = params.get('category');
    const subcategory = params.get('subcategory');
    if (params.has('category')) {
      url = `/categories/posts/${category}`;
      // Remove ASIDE if switch to category
      this.isAsideRequired = false;
      if (params.has('subcategory')) {
        url = `/subcategories/posts/${subcategory}`;
        // Remove ASIDE if switch to subcategory
        this.isAsideRequired = false;
      }
    } else {
      //  ASIDE is visible only at HOME
      this.isAsideRequired = true;
    }
    return url;
  }
  showIfPaginationRequired(postsPerPage, totalPostsCount) {
    if (postsPerPage >= totalPostsCount) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.totalPostsSubscription.unsubscribe();
    this.isMobileResolutionSubscription.unsubscribe();
  }
}
