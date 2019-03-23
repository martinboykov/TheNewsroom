import { Router } from '@angular/router';
import { HelperService } from './../../shared/helper.service';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  @Input() post: any;
  postLink;
  postContent;
  defaultimage = '/assets/images/main/posts/item/pixelation.jpg';
  // defaultimage = 'https://i.imgur.com/EYGsSvV.jpg';


  image;
  offset = 500;
  constructor(
    private helper: HelperService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    const post = this.post;
    this.image = this.post.imageMainPath;
    this.postContent = this.sanitizer.bypassSecurityTrustHtml(post.content);
    this.postLink = this.helper.createRoute(post);
  }
  onPostSelected() {
    this.router.navigateByUrl(this.postLink);
  }
}
