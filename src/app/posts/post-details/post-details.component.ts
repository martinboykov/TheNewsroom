import { AuthData } from './../../auth/auth-data.model';
import { AuthService } from './../../auth/auth.service';
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
import { NotificationService } from 'src/app/shared/notification.service';

const APP_URL = environment.appUrl;
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit, AfterViewChecked, OnDestroy {

  currentUrl: string;
  post: Post;

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
  is400wRequired: boolean;
  private is400wRequiredSubscription: Subscription;
  private currentUserSubscribtion: Subscription;
  currentUser: AuthData;

  constructor(
    private headerService: HeaderService,
    private postService: PostService,
    private authService: AuthService,
    private notifier: NotificationService,
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


    this.currentUserSubscribtion = this.authService.getUserListener()
      .subscribe((userData) => {
        this.currentUser = userData;
      });

    this.currentUrl = APP_URL + this.router.url;

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
          this.is400wRequired = this.windowRef.is_400w;
          if (this.is400wRequired) { // desktop or tablet above 980px width and mobile below 400px width
            this.mainImage = this.post.imageMainPath + '_400w';
          } else { // mobile between 400px and 980px width
            this.mainImage = this.post.imageMainPath;
          }
          // third request
          return this.postService.getRelatedPosts(this.post);
        })
      )
      .pipe(
        concatMap((data) => {
          this.relatedPosts = data || [];
          return this.windowRef.checkIs_400w_RequiredUpdateListener();
        })
      )
      .subscribe((is_400w) => {
        this.is400wRequired = is_400w;
        if (this.is400wRequired) { // desktop or tablet above 980px width and mobile below 400px width
          this.mainImage = this.post.imageMainPath + '_400w';
        } else { // mobile between 400px and 980px width
          this.mainImage = this.post.imageMainPath;
        }
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
    const user = this.authService.getUser();
    if (!user) {
      this.notifier.showInfo('Must login first', 'Unauthenticated attempt');
      return this.router.navigateByUrl('/auth/login');
    }
    if (user.roles.isReader === false) {
      this.notifier.showInfo(
        'You dont have permission to post a comment. Please consult with a Site Administrator',
        'Unauthorized attempt');
      return;
    }
    const author = { _id: user._id, name: user.name, avatar: user.avatar };
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
    // this.is400wRequiredSubscription.unsubscribe();
    this.currentUserSubscribtion.unsubscribe();
  }
}
