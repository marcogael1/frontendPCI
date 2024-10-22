import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../config';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root',
})
export class TokenGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const tokenUrl = `${environment.apiUrl}auth/validate-token`;
    const token = route.queryParamMap.get('token');

    if (!token) {
      this.showErrorAndRedirect('Token faltante');
      return of(false);
    }

    return this.http.post(tokenUrl, { token }).pipe(
      map(() => true), 
      catchError(() => {
        this.showErrorAndRedirect('Token inválido o expirado');
        return of(false);
      })
    );
  }

  private showErrorAndRedirect(message: string): void {
    Toastify({
      text: message,
      backgroundColor: '#FF0000',
      duration: 3000,
    }).showToast();
    this.router.navigate(['/auth/login']);
  }
}
