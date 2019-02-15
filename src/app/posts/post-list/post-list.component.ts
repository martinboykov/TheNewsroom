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
  routerParameters: ParamMap;
  routerParametersSubscription: Subscription;
  category;
  subcategory;
  name;
  url;

  posts: Post[] = []; // strict Post model !?!
  private postsSubscription: Subscription;
  constructor(private headerService: HeaderService,
    private postService: PostService,
    public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.headerService.setRouterParameters(params);
       console.log(params);
      this.routerParameters = params;
      this.url = '/posts';
      if (this.routerParameters.has('category')) {
        this.category = this.routerParameters.get('category');
        this.url = `/categories/posts/${this.category}`;
        if (this.routerParameters.has('subcategory')) {
          this.subcategory = this.routerParameters.get('subcategory');
          this.url = `/subcategories/posts/${this.subcategory}`;
        }
      }
      this.postService.getPosts(this.url);
    });


    this.postsSubscription = this.postService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        // console.log(this.posts);

      })
  }
  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
  }
}
