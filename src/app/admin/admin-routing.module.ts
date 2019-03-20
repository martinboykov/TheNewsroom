import { CategoryEditComponent } from './category-edit/category-edit.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { SubcategoryEditComponent } from './subcategory-edit/subcategory-edit.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'category-new', component: CategoryEditComponent },
  { path: ':categoryName/subcategory-new', component: SubcategoryEditComponent },
  { path: 'category-update/:name', component: CategoryEditComponent },
  { path: 'subcategory-update/:subcategoryName', component: SubcategoryEditComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})


export class AdminRoutingModule { }
