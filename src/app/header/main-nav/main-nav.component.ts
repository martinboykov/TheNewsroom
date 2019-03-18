import { CategoryService } from './../../admin/category.service';
// import { HeaderService } from '../header.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit, OnDestroy {
  categories: any[] = []; // the data is not strict category !?!?, but with populate subcategories name
  private categoriesSubscription: Subscription;
  constructor(private categoryService: CategoryService) { }


  ngOnInit(): void {
    this.categoryService.getCategories();
    this.categoriesSubscription = this.categoryService.getCategoriesUpdateListener()
      .subscribe((categories: any[]) => {
        this.categories = categories;
      });
  }
  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe(); // prevent memory leaks
  }

}
