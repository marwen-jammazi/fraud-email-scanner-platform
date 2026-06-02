import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class InvestigationGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');

    if (role === 'ADMIN' || role === 'ANALYST') {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}
