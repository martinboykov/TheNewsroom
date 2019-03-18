import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AsideRightTrippleComponent } from './aside/aside-right-tripple/aside-right-tripple.component';
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostItemComponent } from './posts/post-item/post-item.component';
import { MainNavComponent } from './header/main-nav/main-nav.component';
import { SmallNavComponent } from './header/small-nav/small-nav.component';

import { ToggleNavigationDirective } from './header/toggleNavigation.directive';
import { ToggleSubNavigationDirective } from './header/toggleSubNavigation.directive';
import { MainNavigationDirective } from './header/mainNavigation.directive';
import { SearchActivationDirective } from './header/searchActivation.directive';
import { InsideAsideDirective } from './aside/aside-right-tripple/insideAside.directive';
import { OutsideAsideDirective } from './aside/aside-right-tripple/outsideAside.directive';
import { SelectorsAsideDirective } from './aside/aside-right-tripple/selectorsAside.directive';


import { TimeAgoPipe } from './shared/time-ago.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AsideRightTrippleComponent,
    PostDetailsComponent,
    PostListComponent,
    MainNavComponent,
    SmallNavComponent,
    PostItemComponent,
    ToggleNavigationDirective,
    ToggleSubNavigationDirective,
    MainNavigationDirective,
    SearchActivationDirective,
    InsideAsideDirective,
    OutsideAsideDirective,
    SelectorsAsideDirective,
    TimeAgoPipe,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxPaginationModule,
    InfiniteScrollModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
