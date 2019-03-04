import { Directive, ElementRef, OnInit, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appToggleSubNavigation]'
})
export class ToggleSubNavigationDirective implements OnInit {
  @Input('appToggleSubNavigation') config = {
    arrowToggle: '.main-nav__subitems',
  };

  isOpen = false;
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('click') open() {
    const toggleArrow = this.el.nativeElement;
    const mainNavSubitems = toggleArrow.parentNode.parentNode.parentNode;
    const accordeon = toggleArrow.parentNode;
    const navSubItems = accordeon.nextSibling;

    if (!toggleArrow.classList.contains('pushed')) {
      const allmainNavItems = mainNavSubitems.querySelectorAll('.main-nav__item');
      allmainNavItems.forEach(element => {
        const otherToggleArrow = element.querySelector('.accordeon__symbol');
        const ohterNavSubItems = element.querySelector('.main-nav__subitems');
        if (otherToggleArrow && ohterNavSubItems) {
          this.renderer.removeClass(otherToggleArrow, 'pushed');
          this.renderer.removeClass(ohterNavSubItems, 'open');
        }
      });
      this.renderer.addClass(navSubItems, 'open');
      this.renderer.addClass(toggleArrow, 'pushed');
    } else {
      this.renderer.removeClass(navSubItems, 'open');
      this.renderer.removeClass(toggleArrow, 'pushed');
    }
  }
  ngOnInit() {
  }
}
