import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRoles = localStorage.getItem('userRoles');
    if (!userRoles) {
      this.router.navigate(['/']);
      return false;
    }

    try {
      const roles = JSON.parse(userRoles) as string[];
      if (roles.includes('ADMIN')) {
        return true;
      }
    } catch (e) {
      console.error('Failed to parse user roles', e);
    }

    this.router.navigate(['/']);
    return false;
  }
}
