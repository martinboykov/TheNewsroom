import { CategoryEditComponent } from './category-edit/category-edit.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { SubcategoryEditComponent } from './subcategory-edit/subcategory-edit.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'category/:name', component: CategoryEditComponent },
  { path: 'subcategory/:name', component: SubcategoryEditComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})


export class AdminRoutingModule { }
