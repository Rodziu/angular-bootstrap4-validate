/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive, Input} from '@angular/core';
import {Validators} from './validators';


@Directive({
    selector: '[url]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: UrlValidatorDirective,
            multi: true
        }
    ]
})
export class UrlValidatorDirective implements Validator {
    @Input('url') mode?: 'single' | 'multiple' | '';

    validate(control: AbstractControl): ValidationErrors | null {
        return Validators.url(this.mode || 'single')(control);
    }
}
