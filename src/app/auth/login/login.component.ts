import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        this.emailValidator,
        Validators.maxLength(255),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(1024),
      ]),
    });
  }
  onLogin() {
    this.isLoading = true;
    this.authService.login(this.email.value, this.password.value)
      .then(() => {
        this.isLoading = false;
      });
    // this.form.reset();
  }
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  get emailErrorRequired() {
    if (this.email.errors) {
      if (this.email.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get emailErrorValidEmail() {
    if (this.email.errors) {
      if (this.email.errors.validEmailError) {
        return true;
      }
    } else {
      return null;
    }
  }
  get emailErrorLengthMax() {
    if (this.email.errors) {
      if (this.email.errors.maxlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get passwordErrorRequired() {
    if (this.password.errors) {
      if (this.password.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get passwordErrorLengthMin() {
    if (this.password.errors) {
      if (this.password.errors.minlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get passwordErrorLengthMax() {
    if (this.password.errors) {
      if (this.password.errors.maxlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  private emailValidator(control: AbstractControl): { [key: string]: boolean } {
    let validityIndicator = false;
    const regex = /^(.)+@(.)+.(.)+$/;
    const email = control.value;
    if (email.length > 0) {
      if (!regex.test(email)) {
        validityIndicator = true;
      } else {
        validityIndicator = false;
      }
      return validityIndicator ? { validEmailError: true } : null;
    } else {
      return null;
    }
  }
}
