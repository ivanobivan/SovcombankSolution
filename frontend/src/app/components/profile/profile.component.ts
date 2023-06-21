import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { finalize } from 'rxjs/operators';
import { ModalService } from '../../services/modal.service';
import { createErrorHandlers, ErrorCode, ErrorText } from '../../validators';

export enum ProfileControls {
    LAST_NAME = 'lastName',
    FIRST_NAME = 'firstName',
    MIDDLE_NAME = 'middleName',
    BIRTH_DATE = 'birthDate',
    EMAIL = 'email',
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    formGroup: FormGroup;
    loading = false;
    controlName = ProfileControls;
    disableButton = false;
    errorHandler!: ReturnType<typeof createErrorHandlers>;
    errorText = ErrorText;
    errorCode = ErrorCode;


    constructor(private userService: UserService,
                private modalService: ModalService) {
        this.formGroup = new FormGroup({
            [ProfileControls.FIRST_NAME]: new FormControl(null, [Validators.required]),
            [ProfileControls.LAST_NAME]: new FormControl(null, [Validators.required]),
            [ProfileControls.MIDDLE_NAME]: new FormControl(null),
            [ProfileControls.BIRTH_DATE]: new FormControl(null, [Validators.required])
        });
        this.errorHandler = createErrorHandlers(this.formGroup);
    }

    ngOnInit(): void {
        this.getUserInfo();
    }

    getUserInfo() {
        this.loading = true;
        this.userService.getUserInfo()
            .pipe(finalize(() => this.loading = false))
            .subscribe(
                user => {
                    this.formGroup.patchValue(user);
                    this.formGroup.disable();
                    this.disableButton = true;
                }
            )
    }

    crateUserInfo() {
        this.formGroup.markAsTouched();
        this.formGroup.updateValueAndValidity();
        if (this.formGroup.valid) {
            this.loading = true;
            this.userService.crateUserInfo(this.formGroup.value)
                .pipe(finalize(() => this.loading = false))
                .subscribe(
                    () => {
                        this.modalService.showInfoModal('Данные успешно сохранены');
                        this.getUserInfo()
                    },
                    err => this.modalService.showErrorModal(err)
                )
        }

    }

}
