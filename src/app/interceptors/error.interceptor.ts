import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejar los diferentes códigos de error
      if (error.status === 400) {
        router.navigate(['/error/400']);
      } else if (error.status === 500) {
        router.navigate(['/error/500']);
      } 
      return throwError(() => error);
    })
  );
};
