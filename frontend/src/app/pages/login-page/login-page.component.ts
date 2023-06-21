import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { createErrorHandlers, CustomValidators, ErrorCode, ErrorText } from '../../validators';
import { AuthenticationService } from '../../services/authentication.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { LoginType, PageName } from '../../app.module';
import { Role } from '../../models';

export enum LoginControlNames {
    EMAIL = 'email',
    PASSWORD = 'password',
    REPEAT_PASSWORD = 'repeatPassword'
}

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

    formGroup!: FormGroup;
    controlName = LoginControlNames;
    errorHandler!: ReturnType<typeof createErrorHandlers>;
    errorText = ErrorText;
    errorCode = ErrorCode;
    loading = false;
    loginType = LoginType.LOGIN;
    LoginType = LoginType;

    private unsubscribe$ = new Subject();

    constructor(private router: Router,
                private route: ActivatedRoute,
                private modalService: ModalService,
                private authenticationService: AuthenticationService) {

        if (this.authenticationService.token) {
            this.router.navigate([PageName.DEFAULT]);
        }

    }

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            [LoginControlNames.EMAIL]: new FormControl(null, [
                Validators.required,
                Validators.email
            ]),
            [LoginControlNames.PASSWORD]: new FormControl(null, [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(20)
            ]),
            [LoginControlNames.REPEAT_PASSWORD]: new FormControl(null),
        });
        this.errorHandler = createErrorHandlers(this.formGroup);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    toggleLoginType() {
        this.loginType = this.loginType === LoginType.LOGIN ? LoginType.SIGNUP : LoginType.LOGIN;
        const {password, repeatPassword} = this.formGroup.controls;
        this.formGroup.setValue({
            [LoginControlNames.EMAIL]: null,
            [LoginControlNames.PASSWORD]: null,
            [LoginControlNames.REPEAT_PASSWORD]: null,
        })
        if (this.loginType === LoginType.SIGNUP) {
            repeatPassword?.addValidators([
                Validators.required,
                CustomValidators.checkEqualPassword(password),
                Validators.minLength(8),
                Validators.maxLength(20)
            ]);
        } else {
            repeatPassword?.clearValidators();
            repeatPassword.setErrors(null);
        }
    }

    onSubmit() {
        this.formGroup.markAsTouched();
        this.formGroup.updateValueAndValidity();
        if (this.formGroup?.valid) {
            this.loading = true;
            const {email, password} = this.formGroup.value;
            if (this.loginType === LoginType.LOGIN) {
                this.authenticationService.login(email, password)
                    .pipe(
                        takeUntil(this.unsubscribe$),
                        finalize(() => this.loading = false)
                    )
                    .subscribe(
                        () => {
                            const isAdmin = this.authenticationService.userInRole([Role.ADMIN]);
                            if (isAdmin) {
                                this.router.navigate([PageName.ADMIN])
                            } else {
                                this.router.navigate([PageName.DASHBOARD, PageName.VIEW])
                            }

                        },
                        error => this.modalService.showErrorModal(error)
                    );
            } else {
                this.authenticationService.signup(email, password)
                    .pipe(
                        takeUntil(this.unsubscribe$),
                        finalize(() => this.loading = false)
                    ).subscribe(
                    () => {
                        this.modalService.showInfoModal('Заявка на регистрацию успешно отправлена');
                        this.toggleLoginType();
                    },
                    error => this.modalService.showErrorModal(error)
                )
            }

        }

    }

}
