import { Component } from '@angular/core';

export enum ModalType {
    ERROR,
    INFO
}

export interface ModalData {
    error?: Error,
    message?: string,
    type?: ModalType,
    onCloseCallback?: () => void,
    title?: string
}

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

    data?: ModalData;
    modalType = ModalType;

    getMessage() {
        if (this.data?.type === ModalType.INFO) {
            return this.data.message;
        } else if (this.data?.type === ModalType.ERROR) {
            return this.data.error?.message;
        }
        return '';
    }

}
