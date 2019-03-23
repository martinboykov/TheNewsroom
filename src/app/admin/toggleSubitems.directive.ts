import { Directive, ElementRef, OnInit, HostListener, Renderer2, Input } from '@angular/core';
import { WindowRef } from '../shared/winref.service';

@Directive({
  selector: '[appToggleSubItems]'
})
export class ToggleSubItemsDirective implements OnInit {
  isOpen = false;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @HostListener('click') open() {
    const toggleArrow = this.el.nativeElement;
    const category = toggleArrow.parentNode.parentNode.parentNode;
    const categoryList = category.parentNode;
    const subcategories = category.querySelectorAll('.subcategory__item');
    const otherSubcategories = categoryList.querySelectorAll('.subcategory__item');
    const otherToggleArrows = categoryList.querySelectorAll('.category--toggle-btn');
    if (!toggleArrow.classList.contains('pushed')) {
      otherSubcategories.forEach((sub) => {
        this.renderer.removeClass(sub, 'open');
      });
      subcategories.forEach((sub) => {
        this.renderer.addClass(sub, 'open');
      });
      otherToggleArrows.forEach(element => {
        this.renderer.removeClass(element, 'pushed');
      });
      this.renderer.addClass(toggleArrow, 'pushed');
    } else {
      subcategories.forEach((sub) => {
        this.renderer.removeClass(sub, 'open');
      });
      this.renderer.removeClass(toggleArrow, 'pushed');
    }
  }
  ngOnInit() {
  }
}
