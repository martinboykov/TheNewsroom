import { HelperService } from './../shared/helper.service';
import { UserService } from './user.service';
import { AuthData } from './../auth/auth-data.model';
import { HeaderService } from './../header/header.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Category } from './category.model';
import { Subcategory } from './subcategory.model';
import { CategoryService } from './category.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  // site structure variables
  categories: Category[] = []; // the data is not strict category !?!?, but with populate subcategories name
  selectedCategory: Category = null;
  isSelected = false;
  previousIndex;
  noSubcategories = false;

  // users variables
  userRoles = [];
  adminUsers: AuthData[] = [];
  writerUsers: AuthData[] = [];
  readerUsers: AuthData[] = [];
  noRoleUsers: AuthData[] = [];
  adminUsersTotalCount: number;
  writerUsersTotalCount: number;
  readerUsersTotalCount: number;
  noRoleUsersTotalCount: number;
  selectedUserRole: string;
  loadingUsers = false;
  users: AuthData[] = [];
  usersBuffer: AuthData[] = [];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  selectedUser: AuthData;
  constructor(
    private categoryService: CategoryService,
    private userService: UserService,
    private helper: HelperService,
    private router: Router) { }

  ngOnInit() {
    // SITE STRUCTURE
    // ------------------
    this.categoryService.getCategoriesFull()
      .subscribe((categories: Category[]) => {
        this.categories = categories;
      });

    // USERS
    // ------------------
    this.userRoles = this.userService.getUserRoles();
    this.userService.getUsersByType('Admin').subscribe((response) => {
      this.adminUsers = response.data;
      this.adminUsersTotalCount = this.adminUsers.length;
    });
    this.userService.getUsersByType('Writer').subscribe((response) => {
      this.writerUsers = response.data;
      this.writerUsersTotalCount = this.writerUsers.length;
    });
    this.userService.getUsersByType('Reader').subscribe((response) => {
      this.readerUsers = response.data;
      this.readerUsersTotalCount = this.readerUsers.length;
    });
    this.userService.getUsersByType('No Role').subscribe((response) => {
      this.noRoleUsers = response.data;
      this.noRoleUsersTotalCount = this.noRoleUsers.length;
    });
  }
  // SITE STRUCTURE
  // ------------------
  onCategorySelected(index) {
    if (this.previousIndex === index) {
      this.previousIndex = null;
      return this.selectedCategory = null;
    }
    this.previousIndex = index;
    this.selectedCategory = this.categories[index];
    // if (!this.selectedCategory) { return; }
  }
  onEditCategory(i) {
    const categoryName = this.categories[i].name;
    this.router.navigateByUrl(`admin/category-update/${categoryName}`);
  }
  onEditSubcategory(subcategory) {
    const subcategoryName = subcategory.name;
    this.router.navigateByUrl(`admin/subcategory-update/${subcategoryName}`);
  }

  onSubcategorySelected(index) {
    // console.log(index);
  }
  addCategroy() {
    this.router.navigateByUrl(`admin/category-new`);
  }
  addSubcategroy() {
    this.router.navigateByUrl(`admin/${this.selectedCategory.name}/subcategory-new`);
  }

  // USERS
  // ------------------
  onUserRoleSelected(i) {
    this.users = [];
    this.selectedUser = null;
    this.selectedUserRole = this.userRoles[i];
    if (this.selectedUserRole === 'Admin') {
      this.users = [...this.adminUsers];
    }
    if (this.selectedUserRole === 'Writer') {
      this.users = [...this.writerUsers];
    }
    if (this.selectedUserRole === 'Reader') {
      this.users = [...this.readerUsers];
    }
    if (this.selectedUserRole === 'No Role') {
      this.users = [...this.noRoleUsers];
    }
  }

  onSelect(user) {
    this.selectedUser = user;
    this.router.navigateByUrl(`admin/user/${user._id}`);
  }

  onScrollToEnd() {
    this.fetchMore();
  }

  onScroll({ end }) {
    if (this.loadingUsers || this.users.length === this.usersBuffer.length) {
      return;
    }

    if (end + this.numberOfItemsFromEndBeforeFetchingMore >= this.usersBuffer.length) {
      this.fetchMore();
    }
  }

  private fetchMore() {
    const len = this.usersBuffer.length;
    const more = this.users.slice(len, this.bufferSize + len);
    this.loadingUsers = true;
    // using timeout here to simulate backend API delay
    const tiemout = timer(300);
    tiemout.subscribe(() => {
      this.loadingUsers = false;
      this.usersBuffer = this.usersBuffer.concat(more);
    });
  }


  ngOnDestroy() {

  }
}
