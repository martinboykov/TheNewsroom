import { Post } from './../post.model';
import { PostService } from './../post.service';
import { ActivatedRoute, ParamMap, UrlSegment, Router } from '@angular/router';
import { HeaderService } from './../../header/header.service';
import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { concatMap, tap } from 'rxjs/operators';
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
  // relatedPosts = [ // faker
  //   {
  //     _id: '5c6f8e83329146033cd81233',
  //     title: `What is Lorem Ipsum`
  //   },
  //   {
  //     _id: '5c6f8e83329146033cd81233',
  //     title: `What is Lorem Ipsum? Lorem Ipsum is`
  //   },
  //   {
  //     _id: '5c6f8e83329146033cd81233',
  //     title: `What is Lorem Ipsum? Lorem Ipsum is simply dummy tex.`
  //   },
  //   {
  //     _id: '5c6f8e83329146033cd81233',
  //     title: `What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has be.`
  //   },
  //   { _id: '5c6f8e83329146033cd81233', title: `What is Lorem Ipsum? Lorem Ipsum is simply dummy textpsum has be.` },
  // ];
  private postSubscription: Subscription;

  constructor(
    private headerService: HeaderService,
    private postService: PostService,
    public route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.currentUrl = APP_URL + this.router.url;
    // this.currentUrl = 'https://thenewsroom.com' + this.router.url;
    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   this.headerService.setRouterParameters(paramMap);
    //   const _id = paramMap.get('_id');
    //   this.postService.getPost(_id)
    //     .subscribe((postData) => {
    //       this.post = postData.data;
    //       this.mainImage = `url(${this.post.imageMainPath})`;

    //       this.postService.getRelatedPosts(this.post)
    //         .subscribe((data) => {
    //           this.relatedPosts = data;
    //         });
    //     });
    // });

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
