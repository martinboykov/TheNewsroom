import { HeaderService } from './../header.service';
import { ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
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
  tag;
  _id;
  routes: any[] = [];
  // currentRoute: any;

  constructor(private headerService: HeaderService,
    private router: Router,
    private location: Location,
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
            name: `${this.tag}`,
            link: `tags/${this.tag}`
          });
        }

        // on search selected
        if (this.routerParameters.has('search')) {
          this.tag = this.routerParameters.get('tag');
          this.routes.push({
            name: `${this.tag}`,
            link: `tags/${this.tag}`
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
      } else {
        // donothing
      }
    });
  }

}
