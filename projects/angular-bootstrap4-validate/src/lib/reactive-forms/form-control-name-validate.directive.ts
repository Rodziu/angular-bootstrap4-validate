/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {Directive, ElementRef, Host, Inject, Input, Optional, Self} from '@angular/core';
import {FormControlName} from '@angular/forms';
import {AbstractValidateElementDirective} from '../abstract-validate-element.directive';
import {ValidateConfigService} from '../validate-config.service';
import {NgFormValidateDirective} from '../template-forms/ng-form-validate.directive';
import {DOCUMENT} from '@angular/common';

@Directive({
    selector: '[formControlName]'
})
export class FormControlNameValidateDirective extends AbstractValidateElementDirective {
    @Input() errorMessage?: Record<string, string>;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(
        protected elementRef: ElementRef<HTMLElement | HTMLInputElement>,
        protected config: ValidateConfigService,
        @Self() @Host() protected ngControl: FormControlName,
        @Optional() @Host() protected ngFormValidate: NgFormValidateDirective,
        @Inject(DOCUMENT) protected document: Document,
    ) {
        super();
    }
}
