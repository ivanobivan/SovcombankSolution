import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent, ModalData, ModalType } from '../components/modal/modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { CardModalComponent, CardModalData } from '../components/card-modal/card-modal.component';

@Injectable({providedIn: 'root'})
export class ModalService {
    constructor(private modalService: NgbModal) {
    }

    showErrorModal(error: HttpErrorResponse) {
        const modal = this.modalService.open(ModalComponent);
        modal.componentInstance.data = {
            error: new Error(error?.error?.error || 'Ошибка работы приложения'),
            type: ModalType.ERROR,
            title: 'Произошла ошибка'
        } as ModalData;

    }

    showInfoModal(message: string) {
        const modal = this.modalService.open(ModalComponent)
        modal.componentInstance.data = {
            message,
            type: ModalType.INFO,
            title: 'Информация'
        } as ModalData;
    }

    showCardModal(data: CardModalData) {
        const modal = this.modalService.open(CardModalComponent)
        modal.componentInstance.data = {
            ...data,
            modal
        };
    }
}
