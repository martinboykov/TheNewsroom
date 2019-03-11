import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      content: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(200)]),
    });
  }
  onClick(event) {
    console.log(event);
    if (event === 'off') {

    }
  }
  onSearchCreated() {
    // if (this.searchForm.invalid) { return; }
    // const userId = this.authService.getUserId();
    console.log(this.searchForm.value.content);
    this.searchForm.reset();
  }

}
