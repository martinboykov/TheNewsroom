import { Subscription } from 'rxjs';
import { Directive, ElementRef, OnInit, HostListener, Renderer2, Input, OnDestroy } from '@angular/core';
import { WindowRef } from '../shared/winref.service';

@Directive({
  selector: '[appSearchActivation]'
})
export class SearchActivationDirective implements OnInit, OnDestroy {
  onButton;
  offButton;
  searchForm;
  document;

  isMobile: boolean;
  private isMobileResolutionSubscription: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2, private windRef: WindowRef) {
  }
  ngOnInit() {
    this.document = this.windRef.nativeWindow.document;
    this.offButton = this.document.querySelector('.activation__button--off');
    this.onButton = this.document.querySelector('.activation__button--on');
    this.renderer.setStyle(this.onButton, 'display', 'flex');
    this.renderer.setStyle(this.offButton, 'display', 'none');
    this.renderer.setStyle(this.document.querySelector('.search__form.mobile'), 'display', 'none');
    this.renderer.setStyle(this.document.querySelector('.search__form.desctop'), 'display', 'none');

    this.isMobile = this.windRef.isMobile;
    if (this.isMobile) {
      this.searchForm = this.document.querySelector('.search__form.mobile');
      this.renderer.setStyle(this.document.querySelector('.search__form.desctop'), 'display', 'none');
    } else {
      this.searchForm = this.document.querySelector('.search__form.desctop');
      this.renderer.setStyle(this.document.querySelector('.search__form.mobile'), 'display', 'none');
    }
    this.windRef.checkIfMobile();
    this.isMobileResolutionSubscription = this.windRef.checkIfMobileUpdateListener()
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
        this.renderer.setStyle(this.onButton, 'display', 'flex');
        this.renderer.setStyle(this.offButton, 'display', 'none');
        this.renderer.setStyle(this.document.querySelector('.search__form.desctop'), 'display', 'none');
        this.renderer.setStyle(this.document.querySelector('.search__form.mobile'), 'display', 'none');
        if (this.isMobile) {
          this.searchForm = this.document.querySelector('.search__form.mobile');
        } else {
          this.searchForm = this.document.querySelector('.search__form.desctop');
        }
      });
  }

  @HostListener('click') open() {
    const el = this.el.nativeElement;
    const offButton = this.document.querySelector('.activation__button--off');
    const onButton = this.document.querySelector('.activation__button--on');
    const searchForm = this.searchForm;
    if (this.el.nativeElement === onButton) {
      this.renderer.setStyle(searchForm, 'display', 'grid');
      this.renderer.setStyle(onButton, 'display', 'none');
      this.renderer.setStyle(offButton, 'display', 'flex');
    }
    if (this.el.nativeElement === offButton) {
      this.renderer.setStyle(searchForm, 'display', 'none');
      this.renderer.setStyle(onButton, 'display', 'flex');
      this.renderer.setStyle(offButton, 'display', 'none');
    }

  }
  ngOnDestroy() {
    this.isMobileResolutionSubscription.unsubscribe();
  }


}
