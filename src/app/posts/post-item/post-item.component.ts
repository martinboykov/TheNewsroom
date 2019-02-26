import { Post } from './../post.model';
import { Component, OnInit, Input } from '@angular/core';
import { ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent implements OnInit {
  @Input() post: any;
  postRoute: string;
  constructor() { }

  ngOnInit() {
    let category;
    let subcategory;
    let title;
    if (this.post.category.name) {
      category = this.post.category.name;
      this.postRoute = `/${category}/post/${this.post._id}/${this.post.title}`;
      if (this.post.subcategory.name) {
        subcategory = this.post.subcategory.name;
        title = this.post.title.replace(/\s+/g, '-');
        this.postRoute = `/${category}/${subcategory}/post/${this.post._id}/${title}`;
      }
    }
  }
}
