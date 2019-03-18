import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SubcategoryEditComponent } from './subcategory-edit/subcategory-edit.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';

@NgModule({
  declarations: [
    AdminComponent,
    SubcategoryEditComponent,
    CategoryEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
