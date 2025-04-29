import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occurred!';

                if (error.status === 0) {
                    errorMessage = 'Cannot connect to the server. Please check if the API is running and CORS is properly configured.';
                } else if (error.error instanceof ErrorEvent) {
                    // Client-side error
                    errorMessage = error.error.message;
                } else {
                    // Server-side error
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }

                console.error('API Error:', {
                    status: error.status,
                    message: errorMessage,
                    error: error
                });

                return throwError(() => ({
                    status: error.status,
                    message: errorMessage
                }));
            })
        );
    }
} 