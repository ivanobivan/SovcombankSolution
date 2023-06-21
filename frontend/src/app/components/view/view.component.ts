import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';
import { BankAccount, Currency } from '../../models';
import { CardModalType } from '../card-modal/card-modal.component';
import { FormControl } from '@angular/forms';
import { CurrencyDescription } from '../../consts';


@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, OnDestroy {

    loading = false;
    bankAccountList: BankAccount[] = [];
    unsubscribe$ = new Subject();
    currencyDescription = CurrencyDescription;

    currencyType = Currency;
    currencyList: Currency[] = []
    isShowCreateNewAccount = false;
    newBackAccountControl: FormControl;

    constructor(private dashboardService: DashboardService,
                private authenticationService: AuthenticationService,
                private modalService: ModalService) {
        this.newBackAccountControl = new FormControl(Currency.RUB);
    }

    ngOnInit(): void {
        this.updateBankAccountList();
        this.getCurrencyList();
    }

    updateBankAccountList() {
        this.loading = true;
        this.dashboardService.getBankAccountList()
            .pipe(
                takeUntil(this.unsubscribe$),
                finalize(() => this.loading = false)
            ).subscribe(
            list => this.bankAccountList = list,
            err => this.modalService.showErrorModal(err)
        )
    }

    getCurrencyList() {
        this.loading = true;
        this.dashboardService.getCurrencyList()
            .pipe(
                takeUntil(this.unsubscribe$),
                finalize(() => this.loading = false)
            ).subscribe(
            list => this.currencyList = list,
            err => this.modalService.showErrorModal(err)
        )
    }

    getCurrencyIcon = (currency: Currency) => `/assets/${currency}.svg`

    showRefillCardModal(id: number) {
        const bankAccount = this.bankAccountList[id];
        this.modalService.showCardModal({
            title: 'Пополнить',
            type: CardModalType.REFILL,
            bankAccount,
            successMessage: 'Счет успешно пополнен',
            okCallBack: this.updateBankAccountList.bind(this)
        });
    }

    showWidthDrawModal(id: number) {
        const bankAccount = this.bankAccountList[id];
        this.modalService.showCardModal({
            title: 'Вывести',
            type: CardModalType.WITHDRAW,
            bankAccount,
            successMessage: 'Денежные средства успешно списаны со счета',
            okCallBack: this.updateBankAccountList.bind(this)
        });
    }

    showCreateNewAccount() {
        this.isShowCreateNewAccount = true;
    }

    hideCreateNewAccount() {
        this.isShowCreateNewAccount = false;
    }

    createNewBankAccount() {
        this.loading = true;
        const newAccountCurrency = this.newBackAccountControl.value;
        this.dashboardService.createNewBankAccount(newAccountCurrency)
            .pipe(
                takeUntil(this.unsubscribe$),
                finalize(() => this.loading = false)
            )
            .subscribe(
                () => {
                    this.modalService.showInfoModal('Счет успешно создан')
                    this.updateBankAccountList();
                },
                err => this.modalService.showErrorModal(err)
            )
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


}
