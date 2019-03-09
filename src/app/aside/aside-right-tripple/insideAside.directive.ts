import { Directive, ElementRef, OnInit, HostListener, Renderer2 } from '@angular/core';
import { WindowRef } from 'src/app/shared/winref.service';

@Directive({
  selector: '[appInsideAside]'
})
export class InsideAsideDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private windowRef: WindowRef) {
  }

  @HostListener('click') open() {
    const currentSection = this.el.nativeElement;
    const wrapper = currentSection.parentNode;
    const posts = wrapper.querySelectorAll('.latest-posts, .popular-posts, .commented-posts');
    const selectors = wrapper.querySelectorAll('.latest, .popular, .commented');
    if (this.windowRef.isMobile) {
      posts.forEach((section) => {
        this.renderer.removeClass(section, 'open');
        // this.renderer.addClass(section, 'hidden');
      });
      selectors.forEach((selector) => {
        this.renderer.removeClass(selector, 'active');
      });
    }
  }

  ngOnInit() {
  }
}
