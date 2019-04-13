import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';
import { PostDetailsRoutingModule } from './post-details-routing.module';
import { PostDetailsComponent } from './post-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TimeAgoPipe } from './../../shared/time-ago.pipe';


@NgModule({
  declarations: [
    PostDetailsComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PostDetailsRoutingModule,
    NgxPaginationModule
  ]
})
export class PostDetailsModule { }
