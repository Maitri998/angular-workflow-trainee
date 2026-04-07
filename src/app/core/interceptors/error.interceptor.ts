import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorHandlerService } from '../services/error-handler.service';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private authService = inject(AuthService);
  private errorHandlerService = inject(ErrorHandlerService);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('ErrorInterceptor: Error caught!');
        console.log('Request URL:', error.url);
        console.log('Status Code:', error.status);
        console.log('Status Message:', error.statusText);
        console.log('Error Details:', error.error);

        if (error.status === 401) {
          console.error('Unauthorized (401): Redirecting to login.');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          console.error('Forbidden (403): Access denied.');
        } else if (error.status === 404) {
          console.error('Not Found (404): Resource not found.');
        } else if (error.status === 500 || error.status === 502 || error.status === 503) {
          console.error('Server Error (' + error.status + '): Please try again later.');
        } else if (error.status === 0) {
          console.error('Network Error (0): Check your connection.');
        }

        const appError = {
          status: error.status,
          message: this.errorHandlerService.getErrorMessage(error.status),
          error: error.error,
          timestamp: new Date(),
        };

        console.log('App Error Object:', appError);
        this.errorHandlerService.logError(appError);

        return throwError(() => appError);
      })
    );
  }
}
