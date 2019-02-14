import { HeaderService } from '../header.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  categories: any[] = []; // the data is not strict category !?!?, but with populate subcategories name
  private categoriesSubscription: Subscription;
  constructor(private headerService: HeaderService) { }


  ngOnInit(): void {
    this.headerService.getCategories();
    this.categoriesSubscription = this.headerService.getCategoriesUpdateListener()
      .subscribe((categories: any[]) => {
        this.categories = categories;
      })
  }
  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe(); // prevent memory leaks
  }

}
