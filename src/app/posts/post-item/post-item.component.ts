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
  constructor(
    private helper: HelperService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    const post = this.post;
    this.postContent = this.sanitizer.bypassSecurityTrustHtml(post.content);
    this.postLink = this.helper.createRoute(post);
  }
  onPostSelected() {
    this.router.navigateByUrl(this.postLink);
  }
}
