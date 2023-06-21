import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Role, User } from '../models';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { PageName } from '../app.module';


@Injectable({providedIn: 'root'})
export class AuthenticationService {

    static STORAGE_TOKEN = 'application-token';

    public token: string | null;

    constructor(private http: HttpClient,
                private router: Router) {
        const token = sessionStorage.getItem(AuthenticationService.STORAGE_TOKEN);
        this.token = token ? token : null;
    }

    isAuthorized(): boolean {
        return !!this.token;
    }

    login(email: string, password: string): Observable<string> {
        return this.http.post<string>(`${environment.apiUrl}/auth/login`, {email, password})
            .pipe(map(token => {
                if (token) {
                    sessionStorage.setItem(AuthenticationService.STORAGE_TOKEN, token);
                    this.token = token;
                }
                return token;
            }));
    }

    userInRole(roles: Role[]): boolean {
        if (this.token) {
            const user = jwt_decode<User>(this.token);
            return roles.includes(user.role);
        }
        return false;
    }

    signup(email: string, password: string): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/auth/signup`, {email, password});
    }

    logout(): Observable<void> {
        return this.http.get<void>(`${environment.apiUrl}/auth/logout`).pipe(
            tap(() => {
                sessionStorage.removeItem(AuthenticationService.STORAGE_TOKEN);
                this.token = null;
                this.router.navigate([PageName.DEFAULT]);
            })
        )
    }

    getUser(): User | null {
        if (this.token) {
            return jwt_decode<User>(this.token);
        }
        return null;
    }

    refreshToken(): Observable<string> {
        return this.http.get<string>(`${environment.apiUrl}/auth/refresh`).pipe(
            tap(token => {
                if (token) {
                    sessionStorage.setItem(AuthenticationService.STORAGE_TOKEN, token);
                    this.token = token;
                }
            })
        )
    }
}
