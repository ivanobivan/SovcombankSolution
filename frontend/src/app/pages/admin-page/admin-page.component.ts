import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Status, User } from '../../models';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit, OnDestroy {

    userList: User[] = []
    unsubscribe$ = new Subject();
    loading = false;
    userStatus = Status;

    constructor(private adminService: AdminService,
                private modalService: ModalService) {
    }

    ngOnInit(): void {
        this.updateUserList();
    }

    getStatusDescription(id: number): string {
        const user = this.userList[id];
        if (user.status === Status.ACTIVE) {
            return 'Активен';
        } else if (user.status === Status.GUEST) {
            return 'Требует активации';
        } else if (user.status === Status.BLOCKED) {
            return 'Заблокирован';
        }
        return '';
    }

    updateUserList() {
        this.loading = true;
        this.adminService.getUserList().pipe(
            takeUntil(this.unsubscribe$),
            finalize(() => {
                this.loading = false;
            })
        ).subscribe(
            list => this.userList = list,
            error => this.modalService.showErrorModal(error)
        )
    }

    activateUser(id: number) {
        const user = this.userList[id];
        this.adminService.activateUser(user).pipe(
            takeUntil(this.unsubscribe$),
            finalize(() => {
                this.loading = false;
            })
        ).subscribe(
            () => {
                this.modalService.showInfoModal('Пользователь успешно активирован');
                this.updateUserList();
            },
            error => this.modalService.showErrorModal(error)
        )
    }

    blockUser(id: number) {
        const user = this.userList[id];
        this.adminService.blockUser(user).pipe(
            takeUntil(this.unsubscribe$),
            finalize(() => this.loading = false)
        ).subscribe(
            () => {
                this.modalService.showInfoModal('Пользователь успешно заблокирован');
                this.updateUserList();
            },
            error => this.modalService.showErrorModal(error)
        )
    }

    isActivationDisabled(id: number) {
        const user = this.userList[id];
        return user.status === Status.ACTIVE;
    }

    isBlockDisabled(id: number) {
        const user = this.userList[id];
        return user.status === Status.BLOCKED;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
