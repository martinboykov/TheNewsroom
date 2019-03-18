import { Post } from './../posts/post.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  createRoute(post: Post) {
    let category;
    let subcategory;
    let title;
    let postRoute;
    if (post.category) {
      category = post.category.name;
      title = post.title.replace(/[^a-z0-9\s-]/ig, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
      postRoute = `/${category}/post/${post._id}/${title}`;
      if (post.subcategory) {
        subcategory = post.subcategory.name;
        title = post.title.replace(/[^a-z0-9\s-]/ig, '')
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase();
        postRoute = `/${category}/${subcategory}/post/${post._id}/${title}`;
      }
    }
    return postRoute;
  }
}
