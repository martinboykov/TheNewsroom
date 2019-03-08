import { Router } from '@angular/router';
import { HelperService } from './../../shared/helper.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  @Input() post: any;
  postLink;
  constructor(private helper: HelperService, private router: Router) { }

  ngOnInit() {
    const post = this.post;
    this.postLink = this.helper.createRoute(post)
  }
  onPostSelected() {
    this.router.navigateByUrl(this.postLink);
  }
}
