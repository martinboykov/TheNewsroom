import { Post } from './../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HeaderService } from './../../header/header.service';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../post.service';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostListComponent implements OnInit, OnDestroy {
  routerParameters: ParamMap;
  routerParametersSubscription: Subscription;
  url;

  posts: Post[] = []; // strict Post model !?!
  private postsSubscription: Subscription;
  private totalPostsSubscription: Subscription;

  itemsPerPage = 15;
  currentPage = 1;
  // totalPostsCount;
  isPaginationRequired;
  config: PaginationInstance = {
    id: 'paginator',
    itemsPerPage: this.itemsPerPage,
    currentPage: this.currentPage,
    totalItems: 0,
  };
  labels: any = {
    previousLabel: '',
    nextLabel: '',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };


  constructor(private headerService: HeaderService,
    private postService: PostService,
    public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.headerService.setRouterParameters(params);

      this.url = this.getUrl(params);

      this.postService.getTotalPostsCount(this.url);

      this.postService.getPosts(this.url, this.config.itemsPerPage, this.config.currentPage);
    });


    this.postsSubscription = this.postService.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
    this.totalPostsSubscription = this.postService.getTotalPostsUpdateListener()
      .subscribe((totalCount: number) => {
        // this.totalPostsCount = totalCount;
        this.config.totalItems = totalCount;
        this.isPaginationRequired = this.showIfPaginationRequired(this.itemsPerPage, totalCount);
        console.log(this.config.totalItems);
      });
  }
  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.totalPostsSubscription.unsubscribe();
  }

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
}
