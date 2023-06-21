import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { TradeService } from '../../services/trade.service';
import { finalize } from 'rxjs/operators';
// @ts-ignore
import { CandlestickChart } from './trade-detail.api.js';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-trade-detail',
    templateUrl: './trade-detail.component.html',
    styleUrls: ['./trade-detail.component.scss']
})
export class TradeDetailComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('chart') chartTemplate?: ElementRef<HTMLDivElement>;
    @ViewChild('container') container?: ElementRef<HTMLDivElement>;

    currentPair?: string;
    socket?: WebSocket;
    loading = false;
    chart: any;
    priceMax?: string;
    priceMin?: string;
    rect?: any;
    currencyFormControl?: FormControl;

    constructor(private route: ActivatedRoute,
                private tradeService: TradeService,
                private modalService: ModalService) {
        this.currencyFormControl = new FormControl(null, [Validators.required]);
    }

    ngOnInit(): void {
        const params = this.route.snapshot.queryParams;
        if (params?.pair) {
            this.currentPair = params.pair;
        }
        this.socket = new WebSocket('wss://ws-api.exmo.com:443/v1/public');
        this.socket.onopen = () => {
            this.socket?.send(`{"id":1,"method":"subscribe","topics":["spot/trades:BTC_USD","spot/ticker:LTC_USD"]}`);
        };
        this.socket.onmessage = event => {
            const obj = JSON.parse(event.data);
            if (obj?.data?.sell_price) {
                this.priceMax = obj.data.sell_price;
            }
            if (obj?.data?.buy_price) {
                this.priceMin = obj.data.buy_price;
            }
        };
        this.loading = true;
        this.tradeService.getCandlesHistory()
            .pipe(finalize(() => this.loading = false))
            .subscribe(
                res => {
                    this.chart = CandlestickChart(res.candles, {
                        date: (d: any) => new Date(d.t),
                        high: (d: any) => d.h,
                        low: (d: any) => d.l,
                        open: (d: any) => d.o,
                        close: (d: any) => d.c,
                        yLabel: '↑ Price ($)',
                        width: this.rect?.width || 1000,
                        height: 500
                    });
                    setTimeout(() => {
                        if (this.chartTemplate) {
                            this.chartTemplate.nativeElement.innerHTML = this.chart.outerHTML;
                        }
                    });
                },
                err => this.modalService.showErrorModal(err)
            )
    }

    ngAfterViewInit(): void {
        if (this.container) {
            this.rect = this.container.nativeElement.getBoundingClientRect();
        }
    }

    buyCurrency() {
        if (this.currentPair && this.currencyFormControl?.valid) {
            this.loading = true;
            const split = this.currentPair.match(/.{3}/g) as string[];
            this.tradeService.buyCurrency(split[1], split[0], this.currencyFormControl.value)
                .pipe(finalize(() => {
                    this.loading = false;
                    this.currencyFormControl?.setValue(null);
                }))
                .subscribe(
                    () => this.modalService.showInfoModal('Покупка успешно выполнена'),
                    err => this.modalService.showErrorModal(err)
                );
        }

    }

    sellCurrency() {
        if (this.currentPair && this.currencyFormControl?.valid) {
            this.loading = true;
            const split = this.currentPair.match(/.{3}/g) as string[];
            this.tradeService.sellCurrency(split[0], split[1], this.currencyFormControl.value)
                .pipe(finalize(() => {
                    this.loading = false;
                    this.currencyFormControl?.setValue(null);
                }))
                .subscribe(
                    () => this.modalService.showInfoModal('Продажа успешно выполнена'),
                    err => this.modalService.showErrorModal(err)
                );
        }
    }

    ngOnDestroy(): void {
        if (this.socket) {
            this.socket.close();
        }
    }


}
