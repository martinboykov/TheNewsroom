import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from 'src/app/posts/post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aside-right-tripple',
  templateUrl: './aside-right-tripple.component.html',
  styleUrls: ['./aside-right-tripple.component.scss']
})
export class AsideRightTrippleComponent implements OnInit, OnDestroy {
  latestPosts: any[]; // strict Post model !?!
  popularPosts: any[]; // strict Post model !?!
  private latestPostsSubscription: Subscription;
  private popularPostsSubscription: Subscription;

  constructor(private postService: PostService) { }

  ngOnInit() {
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
  }

  ngOnDestroy() {
    this.latestPostsSubscription.unsubscribe();
    this.popularPostsSubscription.unsubscribe();
  }
}
