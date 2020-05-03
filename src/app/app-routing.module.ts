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
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {
    path: 'edit',
    loadChildren: () => import('./posts/post-edit/post-edit.module').then(m => m.PostEditModule),
    canActivate: [AuthGuard],
    data: { role: Role.Writer }
  },
  {
    path: 'admin',
    loadChildren:
      () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { role: Role.Admin }
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: ':category', component: PostListComponent },
  {
    path: ':category/post',
    loadChildren: () => import('./posts/post-details/post-details.module').then(m => m.PostDetailsModule),
    data: {preload: true}
  },
  { path: ':category/:subcategory', component: PostListComponent },
  {
    path: ':category/:subcategory/post',
    loadChildren: () => import('./posts/post-details/post-details.module').then(m => m.PostDetailsModule),
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
