import { Post } from './../post.model';
import { PostService } from './../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HeaderService } from './../../header/header.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


import { environment } from '../../../environments/environment';
import { concatMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
const APP_URL = environment.appUrl;
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {
  currentUrl: string;
  post: Post; // strict Post model !?!
  private postSubscription: Subscription;
  mainImage: string;
  relatedPosts: any[];

  commentForm: FormGroup;
  fakeAuthor = { // One-to-Many with Denornmalization: stays the same almost always
    name: 'fakeName',
    _id: '111111111111111111111111',
    avatar: '/assets/images/main/posts/details/avatar.svg',
  };

  constructor(
    private headerService: HeaderService,
    private postService: PostService,
    public route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.commentForm = new FormGroup({
      content: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(3000)]),
    });

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
          this.post = response;
          this.mainImage = `url(${this.post.imageMainPath})`;
          // third request
          return this.postService.getRelatedPosts(this.post);
        })
      )
      .subscribe((data) => {
        this.relatedPosts = data || [];
      });
    this.postSubscription = this.postService.getPostUpdateListener()
      .subscribe((post: Post) => {
        this.post = post;
      });
  }

  get content() { return this.commentForm.get('content'); }
  get contentErrorRequired() {
    if (this.content.errors) {
      // console.log(this.content.errors);
      if (this.content.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get contentErrorLength() {
    if (this.content.errors) {
      // console.log(this.content.errors);
      if (this.content.errors.minlength || this.content.errors.maxlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  onPostComment() {
    if (this.commentForm.invalid) { return; }
    // const userId = this.authService.getUserId();
    const author = this.fakeAuthor;
    const postId = this.post._id;
    const content = this.commentForm.value.content;
    this.postService.addComment(postId, author, content)

    this.commentForm.reset();
  }
}
