import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { createErrorHandlers, ErrorCode, ErrorText } from '../../validators';
import { BankAccount } from '../../models';
import { finalize } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export enum CardModalType {
    REFILL,
    WITHDRAW
}

export interface CardModalData {
    title: string,
    type: CardModalType,
    bankAccount: BankAccount,
    modal?: NgbModalRef,
    successMessage: string,
    okCallBack: () => void
}

export enum CardModalControls {
    NUMBER = 'number',
    HOLDER = 'holder',
    EXPIRED_DATE = 'expiredDate',
    CVV = 'cvv',
    AMOUNT = 'amount'
}

@Component({
    selector: 'app-card-modal',
    templateUrl: './card-modal.component.html',
    styleUrls: ['./card-modal.component.scss']
})
export class CardModalComponent {

    data?: CardModalData;
    formGroup: FormGroup;
    controlName = CardModalControls;
    errorHandler!: ReturnType<typeof createErrorHandlers>;
    errorText = ErrorText;
    errorCode = ErrorCode;
    loading = false;

    constructor(private dashboardService: DashboardService,
                private modalService: ModalService) {
        this.formGroup = new FormGroup({
            [CardModalControls.NUMBER]: new FormControl(null, [Validators.required]),
            [CardModalControls.HOLDER]: new FormControl(null, [Validators.required]),
            [CardModalControls.EXPIRED_DATE]: new FormControl(null, [Validators.required]),
            [CardModalControls.CVV]: new FormControl(null, [Validators.required]),
            [CardModalControls.AMOUNT]: new FormControl(null, [Validators.required]),
        });
        this.errorHandler = createErrorHandlers(this.formGroup);
    }

    proceedMoneyToBankAccount() {
        this.formGroup.markAllAsTouched();
        this.formGroup.updateValueAndValidity();
        if (this.formGroup.valid && this.data?.bankAccount) {
            const {holder, expiredDate, number, amount} = this.formGroup.value;
            const splitNumber = number.match(/.{4}/g);
            const splitDate = expiredDate.match(/.{2}/g);
            this.loading = true;
            let method;
            if (this.data.type === CardModalType.REFILL) {
                method = this.dashboardService.raiseMoneyToBankAccount.bind(this.dashboardService);
            } else {
                method = this.dashboardService.takeOffMoneyToBankAccount.bind(this.dashboardService)
            }
            method(amount, {
                    holder,
                    expiredDate: `${splitDate[0]}/${splitDate[1]}`,
                    trimmedNumber: `${splitNumber[0]} **** **** ${splitNumber[splitNumber.length - 1]}`
                },
                this.data.bankAccount
            ).pipe(
                finalize(() => {
                    this.loading = false;
                    if (this.data?.modal) {
                        this.data.modal.close();
                    }
                })
            ).subscribe(
                () => {
                    this.modalService.showInfoModal(this.data!.successMessage);
                    if (this.data?.okCallBack) {
                        this.data.okCallBack()
                    }
                },
                err => this.modalService.showErrorModal(err)
            )
        }
    }

}
