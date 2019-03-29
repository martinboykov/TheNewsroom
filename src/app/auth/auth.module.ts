
// ------BEWARE-------
// if auth.module is lazy loaded dont import AppRoutingModule here
// (gave me error that Postlistcomponent is no not loaded by ngModule)
// import { AppRoutingModule } from './../app-routing.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AuthRoutingModule,
  ]
})
export class AuthModule { }
