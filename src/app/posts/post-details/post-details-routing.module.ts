import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostDetailsComponent } from './post-details.component';

const routes: Routes = [
  { path: ':_id/:title', component: PostDetailsComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})


export class PostDetailsRoutingModule { }
