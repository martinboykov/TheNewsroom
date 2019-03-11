import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HeaderService } from './header.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WindowRef } from '../shared/winref.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  private isMobileResolutionSubscription: Subscription;
  constructor(private headerService: HeaderService,
    private windRef: WindowRef,
    private router: Router) { }
  ngOnInit() {
    this.searchForm = new FormGroup({
      content: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
    });
    this.windRef.checkIfMobile();
    this.isMobileResolutionSubscription = this.windRef.checkIfMobileUpdateListener()
      .subscribe(() => {
        this.searchForm.reset();
      });

  }
  onSearchCreated() {
    if (this.searchForm.invalid) { return; }
    // const userId = this.authService.getUserId();
    // console.log(this.searchForm.value.content);
    const searchQuery = this.searchForm.value.content;
    this.router.navigateByUrl(`search/${searchQuery}`);
    this.searchForm.reset();
  }
  ngOnDestroy() {
    this.isMobileResolutionSubscription.unsubscribe();
  }
}
