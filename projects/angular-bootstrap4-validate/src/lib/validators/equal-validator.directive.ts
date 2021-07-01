/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive, Input} from '@angular/core';
import {Validators} from './validators';

@Directive({
    selector: '[equal]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: EqualValidatorDirective,
            multi: true
        }
    ]
})
export class EqualValidatorDirective implements Validator {
    @Input('equal') controlNames: string[] | '' = [];

    validate(control: AbstractControl): ValidationErrors | null {
        return Validators.equal(...(this.controlNames || []))(control);
    }
}
