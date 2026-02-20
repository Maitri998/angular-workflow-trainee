import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppError {
  status: number;
  message: string;
  error?: unknown;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  private errorSubject = new BehaviorSubject<AppError | null>(null);
  public error$: Observable<AppError | null> = this.errorSubject.asObservable();

  logError(error: AppError): void {
    console.log(' ErrorHandlerService: Logging error');
    console.log('   Status:', error.status);
    console.log('   Message:', error.message);
    console.log('   Timestamp:', error.timestamp.toISOString());
    this.errorSubject.next(error);
    console.error('💾 Error stored in observable stream');
  }

  clearError(): void {
    console.log(' ErrorHandlerService: Clearing error');
    this.errorSubject.next(null);
  }

  getErrorMessage(status: number): string {
    const messages: { [key: number]: string } = {
      0: 'Network error. Please check your connection.',
      400: 'Bad request. Please check your input.',
      401: 'Unauthorized. Please log in.',
      403: 'Access forbidden.',
      404: 'Resource not found.',
      409: 'Conflict. The resource already exists.',
      422: 'Unprocessable entity. Validation failed.',
      500: 'Server error. Please try again later.',
      502: 'Bad gateway. Please try again later.',
      503: 'Service unavailable. Please try again later.',
    };
    return messages[status] || 'An unexpected error occurred.';
  }
}
