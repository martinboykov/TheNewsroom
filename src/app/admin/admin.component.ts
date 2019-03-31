import { HeaderService } from './../header/header.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from './category.model';
import { Subcategory } from './subcategory.model';
import { CategoryService } from './category.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  categories: Category[] = []; // the data is not strict category !?!?, but with populate subcategories name
  selectedCategory: Category = null;
  isSelected = false;
  previousIndex;
  noSubcategories = false;
  constructor(
    private categoryService: CategoryService,
    private router: Router) { }

  ngOnInit() {
    this.categoryService.getCategoriesFull()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        // console.log(this.categories);
      });
  }
  // STRUCTURE
  // ------------------
  onCategorySelected(index) {
    if (this.previousIndex === index) {
      this.previousIndex = null;
      return this.selectedCategory = null;
    }
    this.previousIndex = index;
    this.selectedCategory = this.categories[index];
    // if (!this.selectedCategory) { return; }
  }
  onEditCategory(i) {
    const categoryName = this.categories[i].name;
    this.router.navigateByUrl(`admin/category-update/${categoryName}`);
  }
  onEditSubcategory(subcategory) {
    const subcategoryName = subcategory.name;
    this.router.navigateByUrl(`admin/subcategory-update/${subcategoryName}`);
  }

  onSubcategorySelected(index) {
    // console.log(index);
  }
  addCategroy() {
    this.router.navigateByUrl(`admin/category-new`);
  }
  addSubcategroy() {
    this.router.navigateByUrl(`admin/${this.selectedCategory.name}/subcategory-new`);
  }

  // USERS
  // ------------------

  // onLoadPosts() {
  //   this.loadingUsers = true;
  //   this.loadedUsers = true;
  //   this.categoryService.getCategoryPostsPartial(this.categoryName)
  //     .subscribe((response) => {
  //       this.loadingUsers = false;
  //       this.categoryPosts = response.data.posts;
  //       console.log(this.categoryPosts);
  //     });
  // }

  // onSelect(post) {
  //   const postLink = this.helper.createRoute(post);
  //   this.router.navigateByUrl(postLink);
  // }

  // onScrollToEnd() {
  //   this.fetchMore();
  // }

  // onScroll({ end }) {
  //   if (this.loadingPosts || this.categoryPosts.length === this.categoryPostsBuffer.length) {
  //     return;
  //   }

  //   if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.categoryPostsBuffer.length) {
  //     this.fetchMore();
  //   }
  // }

  // private fetchMore() {
  //   const len = this.categoryPostsBuffer.length;
  //   const more = this.categoryPosts.slice(len, this.bufferSize + len);
  //   this.loadingPosts = true;
  //   // using timeout here to simulate backend API delay
  //   const tiemout = timer(200);
  //   tiemout.subscribe(() => {
  //     this.loadingPosts = false;
  //     this.categoryPostsBuffer = this.categoryPostsBuffer.concat(more);
  //   });
  //   // setTimeout(() => {
  //   //   this.loadingPosts = false;
  //   //   this.categoryPostsBuffer = this.categoryPostsBuffer.concat(more);
  //   // }, 200);
  // }


  ngOnDestroy() {

  }
}
