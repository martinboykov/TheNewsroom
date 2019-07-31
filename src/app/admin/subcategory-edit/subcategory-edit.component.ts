import { CategoryService } from './../category.service';
import { HelperService } from './../../shared/helper.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SubcategoryService } from '../subcategory.service';
import { Subcategory } from '../subcategory.model';
import { PostService } from 'src/app/posts/post.service';
import { timer } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification.service';
import { isDevMode } from '@angular/core';

@Component({
  selector: 'app-subcategory-edit',
  templateUrl: './subcategory-edit.component.html',
  styleUrls: ['./subcategory-edit.component.scss']
})
export class SubcategoryEditComponent implements OnInit {
  mode: string;
  devMode: boolean;
  subcategoryForm: FormGroup;
  subcategory: Subcategory;
  categoryName: string;
  subcategoryName: string;
  subcategoryPostsTotalCount: number;
  subcategoryPosts: [];
  subcategoryPostsBuffer = [];
  selectedPost;
  loading = false;
  loadingPosts = false;
  loadedPosts = false;
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  constructor(
    private router: Router,
    private location: Location,
    private subcategoryService: SubcategoryService,
    public route: ActivatedRoute,
    private helper: HelperService,
    private categoryService: CategoryService,
    private postService: PostService,
    private notifier: NotificationService,
  ) { }

  ngOnInit() {
    this.devMode = isDevMode();
    this.subcategoryForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]),
      order: new FormControl(99, [
        Validators.min(1),
        Validators.max(99)]),
      isVisible: new FormControl(true),
    });
    this.subcategoryName = this.route.snapshot.params.subcategoryName;
    this.categoryName = this.route.snapshot.params.categoryName;
    if (this.subcategoryName) {
      this.mode = 'update';
      this.subcategoryService.getSubcategory(this.subcategoryName)
        .subscribe((response) => {
          this.subcategory = response.data;
          this.subcategoryForm.controls.name.setValue(this.subcategory.name);
          this.subcategoryForm.controls.order.setValue(this.subcategory.order);
          this.subcategoryForm.controls.isVisible.setValue(this.subcategory.isVisible);
        });
      this.subcategoryService.getSubcategoryPostsTotalCount(this.subcategoryName)
        .subscribe((response) => {
          this.subcategoryPostsTotalCount = response.data;
        });
    } else {
      this.mode = 'create';
    }
  }
  get name() { return this.subcategoryForm.get('name'); }
  get order() { return this.subcategoryForm.get('order'); }
  get isVisible() { return this.subcategoryForm.get('isVisible'); }
  get nameErrorRequired() {
    // const activated = this.username.errors.required;
    if (this.name.errors) {
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

  onEditSubcategory() {
    if (this.subcategoryForm.invalid) { return; }
    let subcategory;
    let options;
    options = {
      mode: this.mode
    };
    if (this.mode === 'update') {
      options._id = this.subcategory._id;
    }

    const name = this.subcategoryForm.value.name;
    const order = this.subcategoryForm.value.order;
    const isVisible = this.subcategoryForm.value.isVisible;

    subcategory = {
      name,
      isVisible,
    };
    if (this.mode === 'create') {
      subcategory.categoryName = this.categoryName;
    }
    if (order) { subcategory.order = order; }
    this.loading = true;
    this.subcategoryService.editSubcategory(subcategory, options)
      .subscribe((response) => {
        this.categoryService.getCategories();
        this.postService.getlatestPosts();
        this.postService.getPopularPosts();
        this.postService.getCommentedPosts();
        this.loading = false;
        this.notifier.showSuccess('Subcategory was updated successfully');
        this.router.navigateByUrl('admin');
      });
  }
  onDelete() {
    this.subcategoryService.deleteSubcategory(this.subcategory);
  }
  onLoadPosts() {
    this.subcategoryService.getSubcategoryPosts(this.subcategoryName)
      .subscribe((response) => {
        this.subcategoryPosts = response.data.posts;
        this.loadedPosts = true;

      });
  }
  // goToPost(post) {
  //   const postLink = this.helper.createRoute(post);
  //   this.router.navigateByUrl(postLink);
  // }
  onSelect(post) {
    const postLink = this.helper.createRoute(post);
    this.router.navigateByUrl(postLink);
  }

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.loading || this.subcategoryPosts.length === this.subcategoryPostsBuffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.subcategoryPostsBuffer.length) {
      this.fetchMore();
    }
  }

  private fetchMore() {
    const len = this.subcategoryPostsBuffer.length;
    const more = this.subcategoryPosts.slice(len, this.bufferSize + len);
    this.loading = true;
    // using timeout here to simulate backend API delay
    const tiemout = timer(200);
    tiemout.subscribe(() => {
      this.loading = false;
      this.subcategoryPostsBuffer = this.subcategoryPostsBuffer.concat(more);
    });
    // setTimeout(() => {
    //   this.loading = false;
    //   this.subcategoryPostsBuffer = this.subcategoryPostsBuffer.concat(more);
    // }, 200);
  }
}
