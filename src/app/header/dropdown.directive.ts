import { Directive, ElementRef, OnInit, HostListener, HostBinding, Renderer2 } from '@angular/core';
@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {

  }
  clicked = false;

  // longer version using native css
  // -------------------------------------
  @HostListener('click', ['$event'])
  onClick(event) {
    if (!this.clicked) {
      this.renderer.addClass(this.elementRef.nativeElement, 'activated');
      const nextSibling = this.renderer.nextSibling(this.elementRef.nativeElement);
      this.renderer.addClass(nextSibling, 'open');
      this.clicked = true;
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'activated');
      const nextSibling = this.renderer.nextSibling(this.elementRef.nativeElement);
      this.renderer.removeClass(nextSibling, 'open');
      this.clicked = false;
    }
  }
  ngOnInit() {
  }
}
