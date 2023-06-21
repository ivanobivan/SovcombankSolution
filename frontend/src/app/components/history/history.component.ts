import { Component, OnInit } from '@angular/core';
import { Currency, History, Operation } from '../../models';
import { HistoryService } from '../../services/history.service';
import { finalize } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';
import { CurrencyDescription } from '../../consts';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    tradeList: History[] = [];
    currencyList: History[] = [];
    loading = false;
    operationDescription = {
        [Operation.SELL]: 'Продажа',
        [Operation.BUY]: 'Покупка',
        [Operation.RAISE]: 'Пополнение',
        [Operation.WITHDRAW]: 'Вывод средств'
    }
    currencyDescription = CurrencyDescription;
    activeTab = 0;

    constructor(private historyService: HistoryService,
                private modalService: ModalService) {
    }

    ngOnInit(): void {
        this.loading = true;
        this.historyService.getBankAccountList()
            .pipe(finalize(() => this.loading = false))
            .subscribe(
                list => {
                    this.tradeList = list?.filter(e => e.operationType === Operation.BUY || e.operationType === Operation.SELL) || [];
                    this.currencyList = list?.filter(e => e.operationType === Operation.RAISE || e.operationType === Operation.WITHDRAW) || [];
                },
                err => this.modalService.showErrorModal(err)
            )
    }

    getLocalDate(num: number) {
        return new Date(num * 1000).toLocaleDateString();
    }

    changeActiveTab(id: number) {
        this.activeTab = id;
    }

    getCurrencyIcon = (currency: Currency) => `/assets/${currency}.svg`;



}
