import { HelperService } from './../../shared/helper.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PostService } from 'src/app/posts/post.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from '../../../environments/environment';
import { WindowRef } from 'src/app/shared/winref.service';
import { Post } from 'src/app/posts/post.model';
import { Location } from '@angular/common';

const APP_URL = environment.appUrl;
@Component({
  selector: 'app-aside-right-tripple',
  templateUrl: './aside-right-tripple.component.html',
  styleUrls: ['./aside-right-tripple.component.scss']
})
export class AsideRightTrippleComponent implements OnInit, OnDestroy {
  isLatestSelected: boolean;
  isPopularSelected: boolean;
  isCommentedSelected: boolean;
  latestPosts: Post[];
  popularPosts: Post[];
  commentedPosts: any[];
  private latestPostsSubscription: Subscription;
  private popularPostsSubscription: Subscription;
  private commentedPostsSubscription: Subscription;
  // windowReference;
  private isMobileResolutionSubscription: Subscription;
  public isMobileResolution: boolean;
  public isAsideRequired: boolean;

  offset = 100;
  defaultimage = '/assets/images/main/posts/item/pixelation.jpg';
  constructor(
    private postService: PostService,
    private helper: HelperService,
    private windowRef: WindowRef,
    private router: Router,
    public route: ActivatedRoute,
    private location: Location) {

  }


  ngOnInit() {
    this.isAsideRequired = true;
    this.router.events.subscribe(() => {
      const isOnEditRoute = this.location.path().indexOf('edit') >= 0;
      const isOnAdminRoute = this.location.path().indexOf('admin') >= 0;
      const isOnAuthRoute = this.location.path().indexOf('auth') >= 0;
      if (isOnEditRoute || isOnAdminRoute || isOnAuthRoute) {
        this.isAsideRequired = false;
      } else {
        this.isAsideRequired = true;
      }
    });

    this.postService.getlatestPosts();
    this.latestPostsSubscription = this.postService.getLatestPostsUpdateListener()
      .subscribe((posts: any[]) => {
        this.latestPosts = posts;
      });

    this.postService.getPopularPosts();
    this.popularPostsSubscription = this.postService.getPopularPostsUpdateListener()
      .subscribe((posts: any[]) => {
        this.popularPosts = posts;
      });
    this.postService.getCommentedPosts();
    this.commentedPostsSubscription = this.postService.getCommentedPostsUpdateListener()
      .subscribe((posts: any[]) => {
        this.commentedPosts = posts;
      });
  }
  fakeScroll() {
    this.windowRef.simulateScroll();
    // test in production if needed
  }
  onPostSelected(post) {
    const postRoute = this.helper.createRoute(post);
    this.postService.getRelatedPosts(post._id);
    this.postService.getPost(post._id);
    this.router.navigateByUrl(postRoute);
  }

  ngOnDestroy() {
    this.latestPostsSubscription.unsubscribe();
    this.popularPostsSubscription.unsubscribe();
    this.commentedPostsSubscription.unsubscribe();
    this.isMobileResolutionSubscription.unsubscribe();
  }
}
