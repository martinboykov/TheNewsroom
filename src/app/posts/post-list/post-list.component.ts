import { WindowRef } from './../../shared/winref.service';
import { Post } from './../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HeaderService } from './../../header/header.service';
import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../post.service';
import { PaginationInstance } from 'ngx-pagination';
import { ChangeEvent } from 'ngx-virtual-scroller';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // Routing
  routerParameters: ParamMap;
  routerParametersSubscription: Subscription;

  // Posts
  url: String;
  posts: Post[] = []; // strict Post model !?!
  private postsSubscription: Subscription;
  private totalPostsSubscription: Subscription;

  // Pagination
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
  buffer: Post[] = [];

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
      this.config.totalItems = 0;
      this.posts = [];
      this.buffer = [];
      this.headerService.setRouterParameters(params);
      this.url = this.getUrl(params);
      this.postService.getTotalPostsCount(this.url);
      this.postService.getPosts(this.url, this.config.itemsPerPage, this.config.currentPage);
    });

    this.postsSubscription = this.postService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        if (this.buffer.length < this.config.totalItems) {
          this.buffer = [...this.buffer, ...this.posts];
        }
      });

    this.totalPostsSubscription = this.postService.getTotalPostsUpdateListener()
      .subscribe((totalCount: number) => {
        console.log(totalCount);
        this.config.totalItems = totalCount;
        this.isPaginationRequired = this.showIfPaginationRequired(this.config.itemsPerPage, totalCount);
      });

    // detect if Moobile resolution < 980px width
    this.isMobileResolution = this.windowRef.isMobile;
    this.windowRef.checkIfMobile();
    this.isMobileResolutionSubscription = this.windowRef.checkIfMobileUpdateListener()
      .subscribe((isMobile) => {
        this.isMobileResolution = isMobile;
      });
  }

  // SCROLLER
  // TODO: to add remove on go up/down
  // fetchMoreStart(event: ChangeEvent) {
  //   console.log(event.startIndex);
  // }
  fetchMoreEnd(event: ChangeEvent) {
     console.log(event.end);
    if (event.end !== this.buffer.length - 1) {
      return;
    }
    if (this.buffer.length >= this.config.totalItems) {
      return;
    }
    this.config.currentPage += 1;
    this.postService.getPosts(this.url, this.config.itemsPerPage, this.config.currentPage);
  }

  // PAGINATION
  onChangedPage(page: number) {
    this.config.currentPage = page;
    this.postService.getPosts(this.url, this.config.itemsPerPage, this.config.currentPage);
  }
  getUrl(params) {
    let url = '/posts';
    const category = params.get('category');
    const subcategory = params.get('subcategory');
    if (params.has('category')) {
      url = `/categories/posts/${category}`;
      if (params.has('subcategory')) {
        url = `/subcategories/posts/${subcategory}`;
      }
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
