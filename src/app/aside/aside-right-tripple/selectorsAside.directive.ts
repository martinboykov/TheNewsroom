import { WindowRef } from 'src/app/shared/winref.service';
import { Directive, ElementRef, OnInit, HostListener, Renderer2, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appSelectType]'
})
export class SelectorsAsideDirective implements OnInit, OnDestroy {
  @Input('appSelectType') selectType: any;
  currentSelector;
  wrapper;
  latestTypeSelector;
  popularTypeSelector;
  commentedTypeSelector;
  latestSection;
  popularSection;
  commentedSection;
  isMobileResolution: boolean;
  private isMobileResolutionSubscription: Subscription;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private windowRef: WindowRef) {
  }

  ngOnInit() {
    // detect if Moobile resolution < 979px width
    this.currentSelector = document.querySelector(this.selectType);
    this.wrapper = document.querySelector('.wrapper');
    this.latestTypeSelector = document.querySelector('.latest');
    this.popularTypeSelector = document.querySelector('.popular');
    this.commentedTypeSelector = document.querySelector('.commented');
    this.latestSection = document.querySelector('.latest-posts');
    this.popularSection = document.querySelector('.popular-posts');
    this.commentedSection = document.querySelector('.commented-posts');
    // this.renderer.addClass(this.latestTypeSelector, 'active');

    this.isMobileResolution = this.windowRef.isMobile;
    if (this.isMobileResolution) {
      this.renderer.removeClass(this.latestTypeSelector, 'active');
      this.renderer.removeClass(this.latestSection, 'open');
    } else {
      this.renderer.addClass(this.latestTypeSelector, 'active');
      this.renderer.addClass(this.latestSection, 'open');
    }
    this.windowRef.checkIfMobile();
    this.isMobileResolutionSubscription = this.windowRef.checkIfMobileUpdateListener()
      .subscribe((isMobile) => {
        this.isMobileResolution = isMobile;
        if (this.isMobileResolution) {
          this.renderer.removeClass(this.latestTypeSelector, 'active');
          this.renderer.removeClass(this.popularTypeSelector, 'active');
          this.renderer.removeClass(this.commentedTypeSelector, 'active');
          this.renderer.removeClass(this.latestSection, 'open');
          this.renderer.removeClass(this.popularSection, 'open');
          this.renderer.removeClass(this.commentedSection, 'open');
        } else {
          this.renderer.addClass(this.latestTypeSelector, 'active');
          this.renderer.removeClass(this.popularTypeSelector, 'active');
          this.renderer.removeClass(this.commentedTypeSelector, 'active');
          this.renderer.addClass(this.latestSection, 'open');
          this.renderer.removeClass(this.popularSection, 'open');
          this.renderer.removeClass(this.commentedSection, 'open');
        }
      });
  }

  @HostListener('click') open() {
    const currentSelector = this.el.nativeElement;
    const currentSection = this.wrapper.querySelector(this.selectType);
    const allSections = this.wrapper.querySelectorAll('.latest-posts, .popular-posts, .commented-posts');
    const allSelectors = this.wrapper.querySelectorAll('.latest, .popular, .commented');

    if (this.isMobileResolution) {
      allSelectors.forEach((selector) => {
        if (currentSelector === selector) {
          if (selector.classList.contains('active')) {
            this.renderer.removeClass(selector, 'active');
          } else {
            this.renderer.addClass(selector, 'active');
          }
        } else {
          this.renderer.removeClass(selector, 'active');
        }
      });
      allSections.forEach((section) => {
        if (currentSection === section) {
          if (currentSection.classList.contains('open')) {
            this.renderer.removeClass(currentSection, 'open');
          } else {
            this.renderer.addClass(currentSection, 'open');
          }
        } else {
          this.renderer.removeClass(section, 'open');
        }
      });

    }
    if (!this.isMobileResolution) {
      allSelectors.forEach((selector) => {
        if (currentSelector === selector) {
          if (selector.classList.contains('active')) {
            // do nothing
          } else {
            this.renderer.addClass(selector, 'active');
          }
        } else {
          this.renderer.removeClass(selector, 'active');
        }
      });
      allSections.forEach((section) => {
        if (currentSection === section) {
          this.renderer.addClass(currentSection, 'open');
        } else {
          this.renderer.removeClass(section, 'open');
        }
      });
    }

  }
  ngOnDestroy() {
    this.isMobileResolutionSubscription.unsubscribe();
  }

}
