import { AuthService } from './../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  isLoading = false;
  signupForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(52)
      ]),
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

  onSignup() {
    this.isLoading = true;
    this.authService.signup(this.name.value, this.email.value, this.password.value)
      .then(() => {
        this.isLoading = false;
      });
  }


  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get nameErrorRequired() {
    if (this.name.errors) {
      if (this.name.errors.required) {
        return true;
      }
    } else {
      return null;
    }
  }
  get nameErrorLengthMin() {
    if (this.name.errors) {
      if (this.name.errors.minlength) {
        return true;
      }
    } else {
      return null;
    }
  }
  get nameErrorLengthMax() {
    if (this.name.errors) {
      if (this.name.errors.maxlength) {
        return true;
      }
    } else {
      return null;
    }
  }
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
