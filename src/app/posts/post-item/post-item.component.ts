import { Post } from 'src/app/posts/post.model';
import { WindowRef } from 'src/app/shared/winref.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HelperService } from './../../shared/helper.service';
import { Component, OnInit, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit, OnChanges, OnDestroy {
  @Input() post: Post;
  // @Input() isMobileResolution: any;
  // @Input() is_400w_Required: any;

  postLink;
  postContent;
  defaultimage = '/assets/images/main/posts/item/pixelation.jpg';

  // windowReference;
  isMobileResolution: boolean;
  is_400w_Required: boolean;
  private isMobileResolutionSubscription: Subscription;
  private is_400w_RequiredSubscription: Subscription;

  image_400w = this.defaultimage;
  image_980w = this.defaultimage;
  offset = 100;
  constructor(
    private helper: HelperService,
    private windowRef: WindowRef,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    const post = this.post;
    // this.image = this.post.imageMainPath;

    this.postContent = this.sanitizer.bypassSecurityTrustHtml(post.content);
    this.postLink = this.helper.createRoute(post);

    this.isMobileResolution = this.windowRef.isMobile;
    this.is_400w_Required = this.windowRef.is_400w;
    if (this.is_400w_Required) { // desktop or tablet above 980px width and mobile below 400px width
      this.image_400w = this.post.imageMainPath + '_400w';
    } else { // mobile between 400px and 980px width
      this.image_980w = this.post.imageMainPath;
    }
    this.windowRef.checkIfMobile();

    // app resolution
    this.isMobileResolutionSubscription = this.windowRef.checkIfMobileUpdateListener()
      .subscribe((isMobile) => {
        this.isMobileResolution = isMobile;
      });

    // image resolution
    this.is_400w_RequiredSubscription = this.windowRef.checkIs_400w_RequiredUpdateListener()
      .subscribe((is_400w) => {
        this.is_400w_Required = is_400w;
        if (this.is_400w_Required) { // desktop or tablet above 980px width and mobile below 400px width
          this.image_400w = this.post.imageMainPath + '_400w';
        } else { // mobile between 400px and 980px width
          this.image_980w = this.post.imageMainPath;
        }
      });
  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  onPostSelected() {
    this.router.navigateByUrl(this.postLink);
  }
  ngOnDestroy() {
    this.isMobileResolutionSubscription.unsubscribe();
    this.is_400w_RequiredSubscription.unsubscribe();
  }
}
