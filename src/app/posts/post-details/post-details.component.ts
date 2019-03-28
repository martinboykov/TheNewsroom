import { DomSanitizer } from '@angular/platform-browser';
import { HelperService } from './../../shared/helper.service';
import { WindowRef } from './../../shared/winref.service';
import { Post } from './../post.model';
import { Comment } from './../comment.model';
import { PostService } from './../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HeaderService } from './../../header/header.service';
import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';
import { concatMap } from 'rxjs/operators';

import { PaginationInstance } from 'ngx-pagination';
import { ScrollToService } from './../../shared/scrollTo.service';
import { Subscription } from 'rxjs';

const APP_URL = environment.appUrl;
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit, AfterViewChecked, OnDestroy {
  // remove once users are incorporated
  fakeAuthor = {
    name: 'fakeName',
    _id: '111111111111111111111111',
    avatar: '/assets/images/main/posts/details/avatar.svg',
  };

  currentUrl: string; // for sharing the post
  post: Post; // strict Post model !?!

  postContent;
  mainImage;
  relatedPosts: any[];

  commentForm: FormGroup;

  comments: Comment[];
  // Pagination comments
  isPaginationRequired: boolean;
  defaultPaginator = {
    itemsPerPage: 15,
    currentPage: 1,
  };
  paginator: PaginationInstance = {
    id: 'paginator',
    itemsPerPage: this.defaultPaginator.itemsPerPage,
    currentPage: this.defaultPaginator.currentPage,
    totalItems: 0,
  };
  labels: any = {
    previousLabel: '',
    nextLabel: '',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'Page',
    screenReaderCurrentLabel: `You're on page`
  };

  offset = 100;
  defaultimage = '/assets/images/main/posts/item/pixelation.jpg';

  loading: boolean;
  // windowReference;
  isMobileResolution: boolean;
  private isMobileResolutionSubscription: Subscription;

  constructor(
    private headerService: HeaderService,
    private postService: PostService,
    public route: ActivatedRoute,
    private router: Router,
    private helper: HelperService,
    private windowRef: WindowRef,
    private scrollService: ScrollToService,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.commentForm = new FormGroup({
      content: new FormControl(null, [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]),
    });

    this.currentUrl = APP_URL + this.route.url;

    // first request
    this.route.paramMap
      .pipe(
        concatMap((paramMap: ParamMap) => {
          this.headerService.setRouterParameters(paramMap);
          const _id = paramMap.get('_id');
          this.postService.updatePopularity(_id);
          // second request
          return this.postService.getPost(_id, this.paginator.itemsPerPage, this.paginator.currentPage);
        })
      )
      .pipe(
        concatMap((response) => {
          this.post = response.post;
          this.mainImage = this.post.imageMainPath;
          this.comments = [...this.post.comments];
          this.postContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);

          this.paginator.totalItems = response.totalCommentsCount;
          this.isPaginationRequired = this.showIfPaginationRequired(this.paginator.itemsPerPage, this.paginator.totalItems);
          this.isMobileResolution = this.windowRef.isMobile;
          if (this.isMobileResolution) { this.mainImage = this.post.imageMainPath; }
          if (!this.isMobileResolution) { this.mainImage = this.post.imageMainPath + '_280w'; }
          // third request
          return this.postService.getRelatedPosts(this.post);
        })
      )
      .pipe(
        concatMap((data) => {
          this.relatedPosts = data || [];
          return this.windowRef.checkIfMobileUpdateListener();
        })
      )
      .subscribe((isMobile) => {
        this.isMobileResolution = isMobile;
        if (this.isMobileResolution) { this.mainImage = this.post.imageMainPath; }
        if (!this.isMobileResolution) { this.mainImage = this.post.imageMainPath + '_280w'; }
      });

    this.windowRef.scrollToTop(0); // consistency for user expirience
    this.changeDetectorRef.detectChanges();
  }

  // Get form related date/errors
  get content() { return this.commentForm.get('content'); }
  get contentErrorRequired() {
    if (this.content.errors) {
      if (this.content.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get contentMinLengthError() {
    if (this.content.errors) {
      if (this.content.errors.minlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get contentMaxLengthError() {
    if (this.content.errors) {
      if (this.content.errors.maxlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  onRelatedPostSelected(post) {
    const postRoute = this.helper.createRoute(post);
    this.router.navigateByUrl(postRoute);
  }

  onTagClick(tagName) {
    this.router.navigateByUrl(`tags/${tagName}`);
  }

  onEdit() {
    this.router.navigateByUrl(`edit/${this.post._id}`);
  }
  onDelete() {
    this.postService.deletePost(this.post);

  }

  // add comment to Post
  onAddComment() {
    if (this.commentForm.invalid) { return; }
    // const userId = this.authService.getUserId();
    const author = this.fakeAuthor;
    const postId = this.post._id;
    const content = this.commentForm.value.content;
    const newComment = { postId, author, content };
    this.postService.addComment(newComment, this.defaultPaginator)
      .subscribe((response) => {
        this.comments = [...response.data.commentsFirstPage];
        this.paginator.totalItems = response.data.totalCommentsCount;
        this.paginator.currentPage = 1;
        this.postService.getCommentedPosts();
        this.commentForm.reset();
      });
  }

  onChangedPage(page: number) {
    this.paginator.currentPage = page;
    const _id = this.post._id;
    const url = `/posts/${_id}/comments`;
    this.postService.getPostComments(url, this.paginator.itemsPerPage, this.paginator.currentPage)
      .subscribe((response) => {
        this.comments = [...response.data];
      });
  }

  // On comment page change scroll to top of comments.
  // (otherwise the client view may change depending the difference in the sizes of the comments in the next and previous page)
  scrollToAnkor(element) {
    this.scrollService.scrollTo(element, 1, 0);
  }

  showIfPaginationRequired(postsPerPage, totalPostsCount) {
    if (postsPerPage >= totalPostsCount) {
      return false;
    }
    return true;
  }

  ngAfterViewChecked() {
    // to prevent error ExpressionChangedAfterItHasBeenCheckedError
    // https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4

    this.changeDetectorRef.detectChanges();

  }

  ngOnDestroy() {
    // this.isMobileResolutionSubscription.unsubscribe();
  }
}
