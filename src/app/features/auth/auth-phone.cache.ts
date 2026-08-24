import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthPhoneCache {
  readonly mobile = signal('');
}
