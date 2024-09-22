import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/evironment';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const ApiInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  let baseUrl = environment.apiUrl;
  let token = localStorage.getItem('token');
  let authService = inject(AuthService);

  // Clone the request object
  let clonedReq = req.clone();

  // Request
  clonedReq = req.clone({
    url: `${baseUrl}${req.url}`,
  });

  // TODO update the condition
  if (token) {
    clonedReq = clonedReq.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  // Response
  return next(clonedReq);
  // .pipe(
  //   catchError((error) => {
  //     // Catch "401 Unauthorized" responses
  //     if (error instanceof HttpErrorResponse && error.status === 401) {
  //       authService.logout();
  //       location.reload();
  //     }
  //     return throwError(error);
  //   })
  // );
};
