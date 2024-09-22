import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/evironment';
import { BehaviorSubject, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  token!: string | null;
  authenticated: boolean = false;
  private _user: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    this.setToken();
  }

  getUser$() {
    return this._user.asObservable();
  }

  setToken() {
    this.token = localStorage.getItem('token');
  }

  check() {
    if (this.authenticated) {
      return of(true);
    }
    if (!this.token) {
      return of(false);
    }
    return of(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.authenticated = false;
    return of(true);
  }

  login(data: any) {
    if (this.authenticated) {
      return throwError('User is already logged in.');
    }

    return this.http.post(`/auth/login`, data).pipe(
      switchMap((res: any) => {
        const { token, ...user } = res.data;
        this.authenticated = true;
        localStorage.setItem('token', token);
        this.setToken();
        this._user.next(user);
        return of(res);
      })
    );
  }
}
