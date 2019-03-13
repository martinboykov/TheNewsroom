import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PostEditRoutingModule } from './post-edit-routing.module';
import { PostEditComponent } from './post-edit.component';
import { JoditAngularModule } from 'jodit-angular';

@NgModule({
  declarations: [
    PostEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PostEditRoutingModule,
    JoditAngularModule,
  ]
})
export class PostEditModule { }
