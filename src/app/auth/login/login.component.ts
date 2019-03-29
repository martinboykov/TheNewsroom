import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  loginForm: FormGroup;
  constructor(
    // private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    });
  }
  onLogin() {
    // this.authService.login(this.form.value.email, this.form.value.password)
    //   .then(() => {
    //     const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    //     this.router.navigate([returnUrl || '/recipes']);
    //   });
    this.isLoading = true;

    // this.authService.login(this.email.value, this.password.value)
    //   .then(() => {
    //     const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    //     this.router.navigate([returnUrl || '/']);
    //   });
    this.isLoading = false;
    // this.form.reset();

  }
}
