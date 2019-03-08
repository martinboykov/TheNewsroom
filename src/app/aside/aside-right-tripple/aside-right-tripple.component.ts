import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { PostService } from 'src/app/posts/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aside-right-tripple',
  templateUrl: './aside-right-tripple.component.html',
  styleUrls: ['./aside-right-tripple.component.scss']
})
export class AsideRightTrippleComponent implements OnInit, OnDestroy {
  isLatestSelected: boolean;
  isPopularSelected: boolean;
  isCommentedSelected: boolean;
  latestPosts: any[]; // strict Post model !?!
  popularPosts: any[]; // strict Post model !?!
  commentedPosts: any[]; // strict Post model !?!
  private latestPostsSubscription: Subscription;
  private popularPostsSubscription: Subscription;
  private commentedPostsSubscription: Subscription;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.isLatestSelected = true;
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

  onSelect(selector) {
    if (selector === 'latest') {
      this.isLatestSelected = true;
      this.isPopularSelected = false;
      this.isCommentedSelected = false;
    }
    if (selector === 'popular') {
      this.isLatestSelected = false;
      this.isPopularSelected = true;
      this.isCommentedSelected = false;
    }
    if (selector === 'commented') {
      this.isLatestSelected = false;
      this.isPopularSelected = false;
      this.isCommentedSelected = true;
    }
  }


  ngOnDestroy() {
    this.latestPostsSubscription.unsubscribe();
    this.popularPostsSubscription.unsubscribe();
    this.commentedPostsSubscription.unsubscribe();
  }
}
