import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  createRoute(post) {
    let category;
    let subcategory;
    let title;
    let postRoute;
    if (post.category) {
      category = post.category.name;
      title = post.title.replace(/\s+/g, '-');
      postRoute = `/${category}/post/${post._id}/${title}`;
      if (post.subcategory) {
        subcategory = post.subcategory.name;
        title = post.title.replace(/\s+/g, '-');
        postRoute = `/${category}/${subcategory}/post/${post._id}/${title}`;
      }
    }
    return postRoute;
  }
}
