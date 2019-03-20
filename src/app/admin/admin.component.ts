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

  onCategorySelected(index) {
    if (this.previousIndex === index) {
      this.previousIndex = null;
      return this.selectedCategory = null;
    }
    this.previousIndex = index;
    this.selectedCategory = this.categories[index];
    // if (!this.selectedCategory) { return; }
    if (this.selectedCategory.subcategories.length !== 0) {
      this.noSubcategories = false;
    } else {
      this.noSubcategories = true;
    }
  }
  onEditCategory(index) {
    const categoryName = this.categories[index].name;
    this.router.navigateByUrl(`admin/category-update/${categoryName}`);
  }
  onEditSubcategory(index) {
    const subcategoryName = this.selectedCategory.subcategories[index].name;
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
  ngOnDestroy() {

  }
}
