import { HeaderService } from './../header.service';
import { ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-small-nav',
  templateUrl: './small-nav.component.html',
  styleUrls: ['./small-nav.component.scss']
})
export class SmallNavComponent implements OnInit {
  routerParameters: ParamMap;
  routerParametersSubscription: Subscription;
  category;
  subcategory;
  name;
  _id;
  routes: any[] = [];
  // currentRoute: any;

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.routerParametersSubscription = this.headerService.getRouterParametersUpdateListener()
      .subscribe((params: ParamMap) => {
        console.log(params);

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
        this.routes.forEach((route) => {
          console.log('ROUTE PARAMS = ' + route.name);
        });
      });

    // this.router.events.subscribe((val) => {
    //   if (location.pathname != '') {
    //     this.currentRoute = location.pathname;
    //   } else {
    //     this.currentRoute = 'Home'
    //   }
    // });
  }
}
