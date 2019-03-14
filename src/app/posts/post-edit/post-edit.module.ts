import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule , FormsModule} from '@angular/forms';
import { PostEditRoutingModule } from './post-edit-routing.module';
import { PostEditComponent } from './post-edit.component';
import { JoditAngularModule } from 'jodit-angular';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    PostEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostEditRoutingModule,
    JoditAngularModule,
    NgSelectModule,
    FormsModule,
  ]
})
export class PostEditModule { }
