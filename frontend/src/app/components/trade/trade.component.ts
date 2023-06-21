import { Component, OnDestroy, OnInit } from '@angular/core';
import { TradeService } from '../../services/trade.service';
import { DashboardService } from '../../services/dashboard.service';
import { finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';
import { forkJoin, of, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PageName } from '../../app.module';

@Component({
    selector: 'app-trade',
    templateUrl: './trade.component.html',
    styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit, OnDestroy {

    currencyPairList?: string[];
    currencyValueList?: number[];
    loading = false;
    unsubscribe$ = new Subject();

    constructor(private tradeService: TradeService,
                private dashboardService: DashboardService,
                private modalService: ModalService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.loading = true;
        this.dashboardService.getCurrencyPairList()
            .pipe(
                takeUntil(this.unsubscribe$),
                tap(list => {
                    this.currencyPairList = list;
                }),
                map(list => list.map(pair => pair.match(/.{3}/g))),
                switchMap(list => forkJoin(list.map(e => {
                        return forkJoin({
                            sendCurrency: of(e![1]),
                            res: this.tradeService.getCurrencyQuotation(e![0])
                        })
                    }))
                ),
                map(list => list.map(e => e.res.rates[e.sendCurrency])),
                finalize(() => this.loading = false)
            )
            .subscribe(
                res => this.currencyValueList = res,
                err => this.modalService.showErrorModal(err)
            )
    }

    goToTradePage(id: number) {
        const pair = this.currencyPairList![id];
        this.router.navigate([PageName.DASHBOARD, PageName.TRADE_DETAIL], {
            queryParams: {
                pair: encodeURI(pair)
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    getCurrencyIcon(pair: string, index: number) {
        const split = pair.match(/.{3}/g) as string[];
        return `/assets/${split[index]}.svg`;
    }
}
