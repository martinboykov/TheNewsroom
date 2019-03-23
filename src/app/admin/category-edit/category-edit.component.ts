import { PostService } from './../../posts/post.service';
import { HelperService } from './../../shared/helper.service';
import { Category } from './../category.model';
import { CategoryService } from './../category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {
  mode: string;
  categoryForm: FormGroup;
  category: Category;
  categoryName: string;
  categoryPosts: [];
  categoryPostsBuffer = [];
  categoryPostsTotalCount: number;
  selectedPost;
  loading = false;
  loadingPosts = false;
  loadedPosts = false;
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  constructor(
    private router: Router,
    private location: Location,
    private categoryService: CategoryService,
    public route: ActivatedRoute,
    private helper: HelperService,
    private postService:PostService,
  ) { }

  ngOnInit() {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]),
      order: new FormControl(99, [
        Validators.min(1),
        Validators.max(99)]),
      isVisible: new FormControl(true),
    });
    this.categoryName = this.route.snapshot.params.name;
    if (this.categoryName) {
      this.mode = 'update';
      this.categoryService.getCategory(this.categoryName)
        .subscribe((response) => {
          this.category = response.data;
          this.categoryForm.controls.name.setValue(this.category.name);
          this.categoryForm.controls.order.setValue(this.category.order);
          this.categoryForm.controls.isVisible.setValue(this.category.isVisible);
        });
      this.categoryService.getCategoryPostsTotalCount(this.categoryName)
        .subscribe((response) => {
          this.categoryPostsTotalCount = response.data;
          console.log(this.categoryPostsTotalCount);

        });
    } else {
      this.mode = 'create';
    }
  }
  get name() { return this.categoryForm.get('name'); }
  get order() { return this.categoryForm.get('order'); }
  get isVisible() { return this.categoryForm.get('isVisible'); }
  get nameErrorRequired() {
    // const activated = this.username.errors.required;
    if (this.name.errors) {
      // console.log(this.title.errors);
      if (this.name.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get nameErrorLengthMin() {
    if (this.name.errors) {
      if (this.name.errors.minlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get nameErrorLengthMax() {
    if (this.name.errors) {
      if (this.name.errors.maxlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get orderErrorMin() {
    if (this.name.errors) {
      if (this.name.errors.min) {
        return true;
      }
    } else {
      return null;
    }
  }
  get orderErrorMax() {
    if (this.name.errors) {
      if (this.name.errors.max) {
        return true;
      }
    } else {
      return null;
    }
  }

  onEditCategory() {
    if (this.categoryForm.invalid) { return; }
    let category;
    let _id;
    if (this.mode === 'update') {
      _id = this.category._id;
    }
    const name = this.categoryForm.value.name;
    const order = this.categoryForm.value.order;
    const isVisible = this.categoryForm.value.isVisible;
    category = {
      name,
      isVisible,
    };
    if (order) { category.order = order; }
    if (_id) { category._id = _id; }
    this.loading = true;
    this.categoryService.editCategory(category, this.mode)
      .subscribe((response) => {
        this.loading = false;
        console.log(response);
        this.categoryService.getCategories();
        this.postService.getlatestPosts();
        this.postService.getPopularPosts();
        this.postService.getCommentedPosts();
        this.router.navigateByUrl('admin');
        this.categoryForm.reset();
      });
  }
  onDelete() {
    if (this.category.subcategories.length !== 0) { return; }
    this.categoryService.deleteCategory(this.category);
  }
  onLoadPosts() {
    this.loadingPosts = true;
    this.loadedPosts = true;
    this.categoryService.getCategoryPostsPartial(this.categoryName)
      .subscribe((response) => {
        this.loadingPosts = false;
        this.categoryPosts = response.data.posts;
        console.log(this.categoryPosts);
      });
  }
  goToPost(post) {
    const postLink = this.helper.createRoute(post);
    this.router.navigateByUrl(postLink);
  }

  onSelect(post) {
    const postLink = this.helper.createRoute(post);
    this.router.navigateByUrl(postLink);
  }

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.loadingPosts || this.categoryPosts.length === this.categoryPostsBuffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.categoryPostsBuffer.length) {
      this.fetchMore();
    }
  }

  private fetchMore() {
    const len = this.categoryPostsBuffer.length;
    const more = this.categoryPosts.slice(len, this.bufferSize + len);
    this.loadingPosts = true;
    // using timeout here to simulate backend API delay
    setTimeout(() => {
      this.loadingPosts = false;
      this.categoryPostsBuffer = this.categoryPostsBuffer.concat(more);
    }, 200);
  }

}
