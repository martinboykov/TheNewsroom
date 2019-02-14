import { Post } from './../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HeaderService } from './../../header/header.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = []; // the data is not strict category !?!?, but with populate subcategories name
  private postsSubscription: Subscription;
  constructor(private headerService: HeaderService,
    private postService: PostService,
    public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.headerService.setRouterParameters(paramMap);
      console.log(paramMap);

    });

    this.postService.getPosts();
    this.postsSubscription = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        console.log(this.posts);

      })
  }
  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}
