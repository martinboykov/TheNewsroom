import { HeaderService } from './../header.service';
import { ParamMap, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
@Component({
  selector: 'app-small-nav',
  templateUrl: './small-nav.component.html',
  styleUrls: ['./small-nav.component.scss']
})
export class SmallNavComponent implements OnInit, OnDestroy {
  routerParameters: ParamMap;
  routerParametersSubscription: Subscription;
  category: string;
  subcategory: string;
  name: string;
  tag: string;
  _id: string;
  userId: string;
  searchQuery: string;
  routes: any[] = [];
  // currentRoute: any;

  constructor(private headerService: HeaderService,
    private router: Router,
    private location: Location,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.routerParametersSubscription = this.headerService.getRouterParametersUpdateListener()
      .subscribe((params: ParamMap) => {
        this.routes = [];
        // this.routes.push({ name: 'Home', link: '' });
        this.routerParameters = params;
        if (this.routerParameters.has('category')) {
          this.category = this.routerParameters.get('category');
          this.routes.push({
            name: this.category,
            link: this.category
          });
        }
        if (this.routerParameters.has('subcategory')) {
          this.subcategory = this.routerParameters.get('subcategory');
          this.routes.push({
            name: this.subcategory,
            link: `${this.category}/${this.subcategory}`
          });
          if (this.routerParameters.has('title')) {
            this.name = this.routerParameters.get('title');
            this._id = this.routerParameters.get('_id');
            this.routes.push({
              name: this.name,
              link: `${this.category}/${this.subcategory}/post/${this._id}/${this.name}`
            });
          }
        } else {
          if (this.routerParameters.has('title')) {
            this.name = this.routerParameters.get('title');
            this._id = this.routerParameters.get('_id');
            this.routes.push({
              name: this.name,
              link: `${this.category}/post/${this._id}/${this.name}`
            });
          }
        }

        // on tag selected
        if (this.routerParameters.has('tag')) {
          this.tag = this.routerParameters.get('tag');
          this.routes.push({
            name: `tag: ${this.tag}`,
            link: `tags/${this.tag}`
          });
        }

        // on search selected
        if (this.routerParameters.has('searchQuery')) {
          this.searchQuery = this.routerParameters.get('searchQuery');
          this.routes.push({
            name: `search: ${this.searchQuery}`,
            link: `search/${this.searchQuery}`
          });
        }
      });
    this.router.events.subscribe(() => {
      this.routes = [];
      if (this.location.path().indexOf('edit') >= 0) {
        this.routes.push({
          name: `edit`,
          link: `edit`
        });
        return;
      }
      if (this.location.path().indexOf('admin') >= 0) {
        this.routes.push({
          name: `admin`,
          link: `admin`
        });
        return;
      }
      if (this.location.path().indexOf('search') >= 0) {
        const index = this.location.path().indexOf('search');
        const searchQuery = this.location.path().substring(index + 7);
        this.routes.push({
          name: `search: ${searchQuery}`,
          link: `search/${searchQuery}`
        });
        return;
      }
      if (this.location.path().indexOf('category-update') >= 0 &&
        this.location.path().indexOf('subcategory-update') < 0) {
        const index = this.location.path().indexOf('category-update');
        this.category = this.location.path().substring(index).replace('category-update/', '');
        this.routes.push({
          name: `category-update: ${this.category}`,
          link: `admin/category/${this.category}`
        });
        return;
      }
      if (this.location.path().indexOf('subcategory-update') >= 0) {
        const index = this.location.path().indexOf('subcategory-update');
        this.subcategory = this.location.path().substring(index).replace('subcategory-update/', '');
        this.routes.push({
          name: `subcategory-update: ${this.subcategory}`,
          link: `admin/subcategory/${this.subcategory}`
        });
        return;
      }
      if (this.location.path().indexOf('category-new') >= 0 &&
        this.location.path().indexOf('subcategory-new') < 0) {
        const index = this.location.path().indexOf('category-new');
        this.category = this.location.path().substring(index).replace('category-new/', '');
        this.routes.push({
          name: `category-new`,
          link: `admin/category/${this.category}`
        });
        return;
      }
      if (this.location.path().indexOf('subcategory-new') >= 0) {
        const indexSubcategory = this.location.path().indexOf('subcategory-new') - 1;
        const indexAdmin = this.location.path().indexOf('admin') + 6;
        this.subcategory = this.location.path().substring(indexSubcategory).replace('subcategory-new/', '');
        this.category = this.location.path().substring(indexAdmin, indexSubcategory);
        this.routes.push({
          name: `${this.category}`,
          link: `admin/category/${this.category}`
        });
        this.routes.push({
          name: `subcategory-new`,
          link: `admin/${this.category}/subcategory-new`
        });
        return;
      }
      if (this.location.path().indexOf('user') >= 0) {
        const indexId = this.location.path().indexOf('user');
        const userId = this.location.path().substring(indexId + 5);
        this.routes.push({
          name: `user: ${userId}`,
          link: `admin/user/${userId}`
        });
        return;
      }
      if (this.location.path().indexOf('login') >= 0) {
        this.routes.push({
          name: `login`,
          link: `auth/login`
        });
        return;
      }
      if (this.location.path().indexOf('signup') >= 0) {
        this.routes.push({
          name: `signup`,
          link: `auth/signup`
        });
        return;
      }
    });
  }
  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.routerParametersSubscription.unsubscribe();
  }
}
