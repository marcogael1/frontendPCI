import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserTypeGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userType = this.authService.getUserType();
    console.log(userType)
    if (userType === 'admin') {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
