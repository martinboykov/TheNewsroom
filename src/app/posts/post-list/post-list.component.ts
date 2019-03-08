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
  paginator: PaginationInstance = {
    id: 'paginatorComments',
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
      this.paginator.currentPage = 1;
      this.currentPageScroller = 1;
      this.paginator.totalItems = 0;
      this.posts = [];
      this.postsPagination = [];
      this.postsScroller = [];
      this.headerService.setRouterParameters(params);
      this.url = this.getUrl(params);

      this.postService.getTotalPostsCount(this.url);
      this.postService.getPosts(this.url, this.itemsPerScroll, this.currentPageScroller);
    });

    this.postsSubscription = this.postService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        if (this.postsPagination.length === 0 || !this.isMobileResolution) {
          this.postsPagination = posts.slice(0, this.paginator.itemsPerPage);
        }
        if (this.postsScroller.length === 0 || this.isMobileResolution) {
          this.postsScroller = [...this.postsScroller, ...posts];
        }
      });

    this.totalPostsSubscription = this.postService.getTotalPostsUpdateListener()
      .subscribe((totalCount: number) => {

        this.paginator.totalItems = totalCount;
        this.isPaginationRequired = this.showIfPaginationRequired(this.paginator.itemsPerPage, totalCount);
      });


    // detect if Moobile resolution < 979px width
    this.isMobileResolution = this.windowRef.isMobile;
    this.windowRef.checkIfMobile();
    this.isMobileResolutionSubscription = this.windowRef.checkIfMobileUpdateListener()
      .subscribe((isMobile) => {
        this.isMobileResolution = isMobile;
      });
  }

  // SCROLLER
  fetchMoreEnd() {
    if (this.postsScroller.length >= this.paginator.totalItems) {
      return;
    }
    this.currentPageScroller += 1;
    return this.postService.getPosts(this.url, this.itemsPerScroll, this.currentPageScroller);
  }

  // PAGINATION
  showIfPaginationRequired(postsPerPage, totalPostsCount) {
    if (postsPerPage >= totalPostsCount) {
      return false;
    }
    return true;
  }
  onChangedPage(page: number) {
    this.paginator.currentPage = page;
    return this.postService.getPosts(this.url, this.paginator.itemsPerPage, this.paginator.currentPage);
  }

  getUrl(params) {
    let url = '/posts';
    const category = params.get('category');
    const subcategory = params.get('subcategory');
    if (params.has('category')) {
      url = `/categories/${category}/posts`;
      // Remove ASIDE if switch to category
      this.isAsideRequired = false;
      if (params.has('subcategory')) {
        url = `/subcategories/${subcategory}/posts`;
        // Remove ASIDE if switch to subcategory
        this.isAsideRequired = false;
      }
    } else {
      //  ASIDE is visible only at HOME
      this.isAsideRequired = true;
    }
    return url;
  }

  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.totalPostsSubscription.unsubscribe();
    this.isMobileResolutionSubscription.unsubscribe();
  }
}
