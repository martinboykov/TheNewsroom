import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { NotFoundComponent } from './error-handling/not-found.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  // { path: 'authors/author/:name/:_id/posts', component: PostListComponent }, // after have authorization
  { path: 'tags/:tag', component: PostListComponent },
  { path: 'search/:searchQuery', component: PostListComponent },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'edit', loadChildren: './posts/post-edit/post-edit.module#PostEditModule' },
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: 'not-found', component: NotFoundComponent },
  { path: ':category', component: PostListComponent },
  { path: ':category/post/:_id/:title', component: PostDetailsComponent },
  { path: ':category/:subcategory', component: PostListComponent },
  { path: ':category/:subcategory/post/:_id/:title', component: PostDetailsComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    // RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
