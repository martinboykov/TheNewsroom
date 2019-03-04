import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  // { path: 'authors/author/:name/:_id/posts', component: PostListComponent }, // after have authorization
  { path: ':category', component: PostListComponent },
  { path: ':category/post/:_id/:title', component: PostDetailsComponent },
  { path: ':category/:subcategory', component: PostListComponent },
  { path: ':category/:subcategory/post/:_id/:title', component: PostDetailsComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    // RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
