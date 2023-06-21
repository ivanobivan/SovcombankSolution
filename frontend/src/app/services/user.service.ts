import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExtendedUser } from '../models';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private http: HttpClient) {
    }

    getUserInfo(): Observable<ExtendedUser> {
        return this.http.get<ExtendedUser>(`${environment.apiUrl}/profile/info`);
    }

    crateUserInfo(user: ExtendedUser): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/profile/create`, {
            ...user
        });
    }
}
