import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message?: string, title?: string, rest?: object): void {
    this.toastr.success(message, title, { onActivateTick: true, ...rest });
  }

  showInfo(message?: string, title?: string, rest?: object): void {
    this.toastr.info(message, title, { onActivateTick: true, ...rest });
  }
  showWarning(message?: string, title?: string, rest?: object): void {
    this.toastr.warning(message, title, { onActivateTick: false, ...rest });
  }

  showError(message?: string, title?: string, rest?: object): void {
    this.toastr.error(message, title, { onActivateTick: true, ...rest });
    // onActivateTick: true ->
    // Fires changeDetectorRef.detectChanges() when activated.
    // Helps show toast from asynchronous events outside of Angular's change detection
  }
}
