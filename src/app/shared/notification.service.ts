import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message?: string, title?: string): void {
    this.toastr.success(message, title, { onActivateTick: true });
  }

  showError(message?: string, title?: string): void {
    this.toastr.error(message, title, { onActivateTick: true });
    // onActivateTick: true ->
    // Fires changeDetectorRef.detectChanges() when activated.
    // Helps show toast from asynchronous events outside of Angular's change detection
  }
}
