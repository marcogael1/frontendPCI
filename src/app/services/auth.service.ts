import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({
  providedIn: 'root', 
})
export class AuthService  {
  constructor(private router: Router) {}
  setUserType(type: string): void {
    localStorage.setItem('userType', type);
  }
  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  isLoggedIn(): boolean {
    return !!this.getUserType(); 
  }

  logout(): void {
    localStorage.clear(); 
    this.router.navigate(['/auth/login']);
  }
}
