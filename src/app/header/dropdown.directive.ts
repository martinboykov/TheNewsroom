import { Directive, ElementRef, OnInit, HostListener, HostBinding, Renderer2, Input, Output, EventEmitter } from '@angular/core';


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
    const nav = toggleArrow.parentNode;
    const navSubItems = nav.nextSibling;

    if (!toggleArrow.classList.contains('pushed')) {
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
