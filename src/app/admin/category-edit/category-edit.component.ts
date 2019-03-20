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
  constructor(
    private router: Router,
    private location: Location,
    private categoryService: CategoryService,
    public route: ActivatedRoute,
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
    const order = this.categoryForm.value.order || 99;
    const isVisible = this.categoryForm.value.isVisible || true;
    category = {
      name,
      isVisible,
      order,
    };
    if (order) { category.order = order; }
    if (_id) { category._id = _id; }
    this.categoryService.editCategory(category, this.mode);
    this.categoryForm.reset();
  }
  onDelete() {
    if (this.category.subcategories.length !== 0) { return; }
    this.categoryService.deleteCategory(this.category);
  }

}
