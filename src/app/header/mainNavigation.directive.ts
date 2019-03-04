import { Directive, ElementRef, OnInit, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMainNavigation]'
})
export class MainNavigationDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const mainNav = this.el.nativeElement;
    const navItems = mainNav.querySelector('.main-nav__items--mobile');
    const subNavItems = mainNav.querySelectorAll('.main-nav__subitems');
    const toggleButton = mainNav.querySelector('.toggle-button');
    const toggleArrows = mainNav.querySelectorAll('.accordeon__symbol');
    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (!clickedInside) {
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
