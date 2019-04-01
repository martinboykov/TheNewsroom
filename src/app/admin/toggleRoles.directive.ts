import { Directive, ElementRef, OnInit, HostListener, Renderer2, Input } from '@angular/core';
import { WindowRef } from '../shared/winref.service';

@Directive({
  selector: '[appToggleRoles]'
})
export class ToggleRolesDirective implements OnInit {
  isOpen = false;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  @HostListener('click') open() {
    const toggleArrow = this.el.nativeElement;
    const userRole = toggleArrow.parentNode.parentNode.parentNode;
    const userRoleList = userRole.parentNode;
    const userRoleUsers = userRole.querySelectorAll('.user-role__users');
    const allUserRoles = userRoleList.querySelectorAll('.user-role__users');
    const allToggleArrows = userRoleList.querySelectorAll('.user-role--toggle-btn');
    if (!toggleArrow.classList.contains('pushed')) {
      allUserRoles.forEach((sub) => {
        this.renderer.removeClass(sub, 'open');
      });
      userRoleUsers.forEach((sub) => {
        this.renderer.addClass(sub, 'open');
      });
      allToggleArrows.forEach(element => {
        this.renderer.removeClass(element, 'pushed');
      });
      this.renderer.addClass(userRole, 'open');
      this.renderer.addClass(toggleArrow, 'pushed');
    } else {
      userRoleUsers.forEach((sub) => {
        this.renderer.removeClass(sub, 'open');
      });
      this.renderer.removeClass(toggleArrow, 'pushed');
    }
  }
  ngOnInit() {
  }
}
