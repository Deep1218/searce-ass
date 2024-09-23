import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/evironment';
import { BehaviorSubject, of, switchMap, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token!: string | null;
  authenticated: boolean = false;
  private _user: BehaviorSubject<any> = new BehaviorSubject(null);
  private user: any;
  constructor(private http: HttpClient) {
    this.setToken();
  }

  getUser() {
    if (!this.user) {
      this.user = JSON.parse(localStorage.getItem('user') as any);
    }
    return this.user;
  }

  setToken() {
    this.token = localStorage.getItem('token');
  }
  isLoggedIn(): boolean {
    this.setToken();
    return !!this.token;
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
        localStorage.setItem('user', JSON.stringify(user));
        this.setToken();
        this.user = user;
        return of(res);
      })
    );
  }
}
