import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../config';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService,) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.http.get(`${environment.apiUrl}auth/validate-session`, { withCredentials: true })
      .pipe(
        map((response: any) => {
          const userRole = response.role;
          const isAdminRoute = state.url.startsWith('/admin');
          if (isAdminRoute && userRole !== 'admin') {
            this.authService.login();
            this.router.navigate(['/home']);  
            return false;
          }
          return true;
        }),
        catchError((error) => {
          this.router.navigate(['/auth/login']);  
          return [false];
        })
      );
  }
}
