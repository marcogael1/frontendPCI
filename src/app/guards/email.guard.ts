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
export class EmailGuard implements CanActivate {
  constructor(private http: HttpClient, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token = route.queryParamMap.get('token'); 
    const verifyEmailUrl = `${environment.apiUrl}auth/verify-email`; 
    console.log('Token capturado desde la URL:', token);

    if (!token) {
      this.showErrorAndRedirect('Token faltante'); 
      return of(false);
    }

    return this.http.post(verifyEmailUrl, { token }).pipe(
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
    this.router.navigate(['/login']); 
  }
}
