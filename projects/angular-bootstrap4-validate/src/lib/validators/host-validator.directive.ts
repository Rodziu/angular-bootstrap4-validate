/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive, Input} from '@angular/core';
import {Validators} from './validators';


@Directive({
    selector: '[host]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: HostValidatorDirective,
            multi: true
        }
    ]
})
export class HostValidatorDirective implements Validator {
    @Input('host') mode?: 'single' | 'multiple' | '';

    validate(control: AbstractControl): ValidationErrors | null {
        return Validators.host(this.mode || 'single')(control);
    }
}
