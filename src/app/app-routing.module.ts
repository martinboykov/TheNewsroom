import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: ':category', component: PostListComponent },
  { path: ':category/post/:name', component: PostDetailsComponent },
  { path: ':category/:subcategory', component: PostListComponent },
  { path: ':category/:subcategory/post/:name', component: PostDetailsComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
