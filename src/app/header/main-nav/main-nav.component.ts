import { HeaderService } from '../header.service';
import { Component, OnInit } from '@angular/core';
import { Category } from '../category.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  categories: Category[] = [];
  private categoriesSubscription: Subscription;
  constructor(private headerService: HeaderService) { }


  ngOnInit(): void {
    this.headerService.getCategories();
    this.categoriesSubscription = this.headerService.getCategoriesUpdateListener()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
      })
  }
  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe(); // prevent memory leaks
  }

}
