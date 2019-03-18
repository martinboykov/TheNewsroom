import { WindowRef } from 'src/app/shared/winref.service';
import { Directive, ElementRef, OnInit, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appOutsideAside]'
})
export class OutsideAsideDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private windowRef: WindowRef) {
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const wrapper = this.el.nativeElement;
    const posts = wrapper.querySelectorAll('[class*=\'posts\']');
    const str = 'adada';
    const selectors = wrapper.querySelectorAll('.latest, .popular, .commented');
    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (!clickedInside && this.windowRef.isMobile) {
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
