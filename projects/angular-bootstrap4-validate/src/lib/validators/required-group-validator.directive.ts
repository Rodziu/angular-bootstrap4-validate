/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {FormGroup, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Directive, Input} from '@angular/core';
import {Validators} from './validators';


@Directive({
    selector: '[requiredGroup]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: RequiredGroupValidatorDirective,
            multi: true
        }
    ]
})
export class RequiredGroupValidatorDirective implements Validator {
    @Input() requiredGroup?: { mode?: 'or' | 'and', value?: unknown, controlNames?: string[] } | '';

    validate(controlGroup: FormGroup): ValidationErrors | null {
        const options: this['requiredGroup'] = typeof this.requiredGroup === 'object' ? this.requiredGroup : {};

        return Validators.requiredGroup(
            options?.mode,
            options?.value,
            ...(options?.controlNames || [])
        )(controlGroup);
    }
}
