import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { History } from '../models';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class HistoryService {

    constructor(private http: HttpClient) {
    }

    getBankAccountList(): Observable<History[]> {
        return this.http.get<History[]>(`${environment.apiUrl}/api/account/history`);
    }
}
