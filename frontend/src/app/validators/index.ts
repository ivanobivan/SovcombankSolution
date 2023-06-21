import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * @enum ErrorCode - коды ошибок контролов
 */
export enum ErrorCode {
    REQUIRED = 'required',
    EQUALS = 'equals',
    EMAIL = 'email',
    MIN_LENGTH = 'minlength',
    MAX_LENGTH = 'maxlength',
    MASK = 'mask'
}

export const ErrorText = {
    [ErrorCode.REQUIRED]: 'Поле должно быть заполнено',
    [ErrorCode.EQUALS]: 'Значения паролей не совпадают',
    [ErrorCode.EMAIL]: 'Не корректный email',
    [ErrorCode.MIN_LENGTH]: 'Пароль должен состоять минимум из 8 символов',
    [ErrorCode.MAX_LENGTH]: 'Пароль не должен содержать более 20 символов',
    [ErrorCode.MASK]: 'Значение не соответствует маске',
}

export class CustomValidators {
    static checkEqualPassword(passwordControl: AbstractControl): ValidatorFn {
        return (control: AbstractControl) => {
            if (control && control.value) {
                const password = passwordControl.value;
                if (control.value !== password) {
                    return {[ErrorCode.EQUALS]: true};
                }
            }
            return null;
        }
    }
}

export const createErrorHandlers = (abstractControl: AbstractControl) => ({
    checkRequired: (path?: string[]): boolean => {
        const control = path ? abstractControl.get(path) : abstractControl;
        if (control) {
            return control.touched && control.hasError(ErrorCode.REQUIRED);
        }
        return false;
    },
    checkEquals: (path?: string[]): boolean => {
        const control = path ? abstractControl.get(path) : abstractControl;
        if (control) {
            return control.touched && control.hasError(ErrorCode.EQUALS);
        }
        return false;
    },
    checkEmail: (path?: string[]): boolean => {
        const control = path ? abstractControl.get(path) : abstractControl;
        if (control) {
            return control.touched && control.hasError(ErrorCode.EMAIL);
        }
        return false;
    },
    checkMinLength: (path?: string[]): boolean => {
        const control = path ? abstractControl.get(path) : abstractControl;
        if (control) {
            return control.touched && control.hasError(ErrorCode.MIN_LENGTH);
        }
        return false;
    },
    checkMaxLength: (path?: string[]): boolean => {
        const control = path ? abstractControl.get(path) : abstractControl;
        if (control) {
            return control.touched && control.hasError(ErrorCode.MAX_LENGTH);
        }
        return false;
    },
    checkMask: (path?: string[]): boolean => {
        const control = path ? abstractControl.get(path) : abstractControl;
        if (control) {
            return control.touched && control.hasError(ErrorCode.MASK);
        }
        return false;
    },
});
