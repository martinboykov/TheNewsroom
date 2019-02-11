import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AsideRightTrippleComponent } from './aside/aside-right-tripple/aside-right-tripple.component';
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { MainNavComponent } from './header/main-nav/main-nav.component';
import { SearchComponent } from './header/search/search.component';
import { SmallNavComponent } from './header/small-nav/small-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AsideRightTrippleComponent,
    PostDetailsComponent,
    PostListComponent,
    MainNavComponent,
    SearchComponent,
    SmallNavComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
