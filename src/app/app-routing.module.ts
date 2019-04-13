import { AuthGuard } from './auth/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomPreloading } from './custom-preloading';
import { Role } from './admin/user-roles';
import { PostListComponent } from './posts/post-list/post-list.component';
import { NotFoundComponent } from './error-handling/not-found.component';

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'tags/:tag', component: PostListComponent },
  { path: 'search/:searchQuery', component: PostListComponent },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  {
    path: 'edit',
    loadChildren: './posts/post-edit/post-edit.module#PostEditModule',
    canActivate: [AuthGuard],
    data: { role: Role.Writer }
  },
  {
    path: 'admin',
    loadChildren:
      './admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    data: { role: Role.Admin }
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: ':category', component: PostListComponent },
  {
    path: ':category/post',
    loadChildren: './posts/post-details/post-details.module#PostDetailsModule',
    data: {preload: true}
  },
  { path: ':category/:subcategory', component: PostListComponent },
  {
    path: ':category/:subcategory/post',
    loadChildren: './posts/post-details/post-details.module#PostDetailsModule',
    data: {preload: true}
  },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloading })
    // RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}),
  ],
  exports: [RouterModule],
  providers: [CustomPreloading]
})
export class AppRoutingModule { }
