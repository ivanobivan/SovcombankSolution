import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class TradeService {
    constructor(private http: HttpClient) {
    }

    getCurrencyQuotation(currency: string): Observable<any> {
        return this.http.get<any>(`https://api.exchangerate.host/latest?base=${currency}`);
    }

    getCandlesHistory() {
        return this.http.get<any>(`https://api.exmo.com/v1.1/candles_history?symbol=BTC_USD&resolution=1D&from=1661994000&to=1668906000`);
    }

    buyCurrency(fromCurrency: string, toCurrency: string, amount: number) {
        return this.http.post<any>(`${environment.apiUrl}/api/trade/buy`, {
            fromCurrency,
            toCurrency,
            amount
        });
    }

    sellCurrency(fromCurrency: string, toCurrency: string, amount: number) {
        return this.http.post<any>(`${environment.apiUrl}/api/trade/sell`, {
            fromCurrency,
            toCurrency,
            amount
        });
    }
}
