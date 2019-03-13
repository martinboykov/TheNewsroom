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
      if (this.location.path().indexOf('edit') >= 0) {
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
  onPostSelected(post) {
    const postRoute = this.helper.createRoute(post);
    this.router.navigateByUrl(postRoute);
  }

  ngOnDestroy() {
    this.latestPostsSubscription.unsubscribe();
    this.popularPostsSubscription.unsubscribe();
    this.commentedPostsSubscription.unsubscribe();
    this.isMobileResolutionSubscription.unsubscribe();
  }
}
