import { Post } from './../post.model';
import { PostService } from './../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HeaderService } from './../../header/header.service';
import { Component, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { concatMap } from 'rxjs/operators';
const APP_URL = environment.appUrl;
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  currentUrl: string;
  post: Post; // strict Post model !?!
  mainImage: string;
  relatedPosts: any[];

  constructor(
    private headerService: HeaderService,
    private postService: PostService,
    public route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.currentUrl = APP_URL + this.router.url;

    // first request
    this.route.paramMap
      .pipe(
        concatMap((paramMap: ParamMap) => {
          this.headerService.setRouterParameters(paramMap);
          const _id = paramMap.get('_id');

          // second request
          return this.postService.getPost(_id);
        })
      )
      .pipe(
        concatMap((response) => {
          this.post = response.data;
          this.mainImage = `url(${this.post.imageMainPath})`;

          // third request
          return this.postService.getRelatedPosts(this.post);
        })
      )
      .subscribe((data) => {
        this.relatedPosts = data;
      });

  }
}
