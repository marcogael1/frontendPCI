import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLogged: boolean = false;

  constructor() {}

  isLoggedIn(): boolean | null {
    return this.isLogged;
  }

  login(): void {
    this.isLogged = true;
  }
  logout(): void {
    this.isLogged = false;
  }
}
