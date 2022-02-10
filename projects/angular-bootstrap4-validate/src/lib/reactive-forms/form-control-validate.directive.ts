/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {Directive, ElementRef, Inject, Input, KeyValueDiffers, Optional, Self} from '@angular/core';
import {FormControlDirective} from '@angular/forms';
import {AbstractValidateElementDirective, VALIDATE_ELEMENT} from '../abstract-validate-element.directive';
import {ValidateConfigService} from '../validate-config.service';
import {NgFormValidateDirective} from '../template-forms/ng-form-validate.directive';
import {DOCUMENT} from '@angular/common';

@Directive({
    selector: '[formControl]',
    providers: [
        {
            provide: VALIDATE_ELEMENT,
            useExisting: FormControlValidateDirective
        }
    ]
})
export class FormControlValidateDirective extends AbstractValidateElementDirective {
    @Input() errorMessage?: Record<string, string>;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(
        protected elementRef: ElementRef<HTMLElement | HTMLInputElement>,
        protected config: ValidateConfigService,
        protected keyValueDiffers: KeyValueDiffers,
        @Self() protected ngControl: FormControlDirective,
        @Optional() protected ngFormValidate: NgFormValidateDirective,
        @Inject(DOCUMENT) protected document: Document,
    ) {
        super();
    }
}
