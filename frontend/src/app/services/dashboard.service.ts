import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount, Card, Currency } from '../models';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class DashboardService {


    constructor(private http: HttpClient) {
    }

    getBankAccountList(): Observable<BankAccount[]> {
        return this.http.get<BankAccount[]>(`${environment.apiUrl}/api/account/list`);
    }

    raiseMoneyToBankAccount(money: number, card: Card, bankAccount: BankAccount): Observable<void> {
        const {amount, ...rest} = bankAccount;
        return this.http.post<void>(`${environment.apiUrl}/api/account/refill`, {
            amount: money,
            ...card,
            ...rest
        });
    }

    takeOffMoneyToBankAccount(money: number, card: Card, bankAccount: BankAccount): Observable<void> {
        const {amount, ...rest} = bankAccount;
        return this.http.post<void>(`${environment.apiUrl}/api/account/withdraw`, {
            amount: money,
            ...card,
            ...rest
        });
    }

    createNewBankAccount(currency: Currency) {
        return this.http.post<void>(`${environment.apiUrl}/api/account/create`, {
            currency
        });
    }

    getCurrencyList(): Observable<Currency[]> {
        return this.http.get<Currency[]>(`${environment.apiUrl}/api/currency/list`);
    }

    getCurrencyPairList(): Observable<string[]> {
        return this.http.get<string[]>(`${environment.apiUrl}/api/currency/pairs`);
    }
}
