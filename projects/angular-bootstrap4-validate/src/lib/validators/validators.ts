/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators as ng2Validators} from '@angular/forms';
import {IValidateAbstractControl} from '../abstract-validate-element.directive';

export abstract class Validators extends ng2Validators {
    static number(control: IValidateAbstractControl): ValidationErrors | null {
        if (control.__elementValidity && control.__elementValidity.badInput) {
            return {
                number: true
            };
        }
        return null;
    }

    static url(mode: 'single' | 'multiple' = 'single'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return validateSingleOrMultiple(
                mode,
                control,
                (value) => /^https?:\/\/.+/.test(value),
                'url'
            )
        }
    }

    static host(mode: 'single' | 'multiple' = 'single'): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return validateSingleOrMultiple(
                mode,
                control,
                // eslint-disable-next-line max-len
                (value) => /^([a-z\u00A1-\uFFFF0-9]|[a-z\u00A1-\uFFFF0-9][a-z\u00A1-\uFFFF0-9-]{0,61}[a-z\u00A1-\uFFFF0-9])(\.([a-z\u00A1-\uFFFF0-9]|[a-z\u00A1-\uFFFF0-9][a-z\u00A1-\uFFFF0-9-]{0,61}[a-z\u00A1-\uFFFF0-9]))*$/i.test(value),
                'host'
            )
        }
    }

    static equal(...controlNames: string[]): ValidatorFn {
        return (controlGroup: AbstractControl | FormGroup): ValidationErrors | null => {
            const isValid = getControls(controlGroup, controlNames)
                .every((control, idx, controls) => {
                    if (idx === 0) {
                        return true;
                    }
                    const previous = controls[idx - 1];
                    return control !== null && previous !== null && control.value === previous.value;
                });

            return isValid ? null : {
                equal: true
            };
        }
    }

    static requiredGroup(mode: 'or' | 'and' = 'or', value?: unknown, ...controlNames: string[]): ValidatorFn {
        return (controlGroup: AbstractControl | FormGroup): ValidationErrors | null => {
            const controls = getControls(controlGroup, controlNames),
                validateControl = (control: AbstractControl) => {
                    return typeof value === 'undefined'
                        ? control.value !== null && control.value.length
                        : control.value === value;
                };
            const isValid = mode === 'or'
                ? controls.some(validateControl)
                : controls.every(validateControl);

            return isValid ? null : {
                [`requiredGroup${mode === 'or' ? 'Or' : 'And'}`]: typeof value === 'undefined' ? true : value
            };
        }
    }
}

function validateSingleOrMultiple(
    mode: 'single' | 'multiple',
    control: AbstractControl,
    validator: (value: string) => boolean,
    validatorName: string
): ValidationErrors | null {
    let isValid = true;
    if (typeof control.value === 'string' && control.value.length) {
        if (mode === 'multiple') {
            const rows = control.value.split(/\r\n|\r|\n/);
            isValid = !rows.some((line) => {
                line = line.trim();
                return line.length && !validator(line);
            });
        } else {
            isValid = validator(control.value);
        }
    }
    return isValid ? null : {
        [mode === 'single' ? validatorName : `${validatorName}Multiple`]: true
    };
}

function getControls(controlGroup: AbstractControl | FormGroup, controlNames: string[]): AbstractControl[] {
    return controlNames.length || !('controls' in controlGroup)
        ? controlNames
            .map((controlName) => controlGroup.get(controlName))
            .filter((x) => x !== null) as AbstractControl[]
        : Object.values(controlGroup.controls);
}
