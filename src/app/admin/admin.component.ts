import { HeaderService } from './../header/header.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from './category.model';
import { Subcategory } from './subcategory.model';
import { CategoryService } from './category.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  categories: Category[] = []; // the data is not strict category !?!?, but with populate subcategories name
  private categoriesSubscription: Subscription;
  selectedCategory: Category = null;
  noSubcategories = false;
  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getCategoriesFull()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        console.log(this.categories);
      });
  }
  ngOnDestroy() {

  }
  onCategorySelected() {
    if (this.selectedCategory.subcategories.length !== 0) {
      this.noSubcategories = false;
    }
    if (this.selectedCategory.subcategories.length === 0) {
      this.noSubcategories = true;
    }
  }
  addSubcategroy(selectedCategory) {

  }
  addCategroy(){

  }
}
