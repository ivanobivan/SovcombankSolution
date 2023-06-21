import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';


@Injectable({providedIn: 'root'})
export class AdminService {


    constructor(private http: HttpClient) {
    }


    getUserList(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.apiUrl}/admin/userList`);
    }

    activateUser(user: User): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/admin/activate`, {
            email: user.email
        });
    }

    blockUser(user: User): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/admin/block`, {
            email: user.email
        });
    }
}
