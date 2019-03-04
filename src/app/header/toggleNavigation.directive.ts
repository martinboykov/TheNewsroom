import { Directive, ElementRef, OnInit, HostListener, Renderer2, Input, } from '@angular/core';


@Directive({
  selector: '[appToggleNavigation]'
})
export class ToggleNavigationDirective implements OnInit {
  @Input('appToggleNavigation') config = {
    buttonToggle: '.main-nav__items--mobile',
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('click') open() {
    const toggleButton = this.el.nativeElement;
    const mainNav = toggleButton.parentNode.parentNode;
    const navItems = mainNav.querySelector(this.config.buttonToggle);
    const subNavItems = mainNav.querySelectorAll('.main-nav__subitems');
    const toggleArrows = mainNav.querySelectorAll('.accordeon__symbol');
    if (!toggleButton.classList.contains('pushed')) {
      this.renderer.addClass(navItems, 'open');
      this.renderer.addClass(toggleButton, 'pushed');
    } else {
      this.renderer.removeClass(navItems, 'open');
      subNavItems.forEach(element => {
        this.renderer.removeClass(element, 'open');
      });
      toggleArrows.forEach(element => {
        this.renderer.removeClass(element, 'pushed');
      });
      this.renderer.removeClass(toggleButton, 'pushed');
    }
  }
  ngOnInit() {
  }
}
