/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive} from '@angular/core';
import {Validators} from './validators';


@Directive({
    selector: '[number]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: NumberValidatorDirective,
            multi: true
        }
    ]
})
export class NumberValidatorDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        return Validators.number(control);
    }
}
