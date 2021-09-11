/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {Directive, ElementRef, Host, Inject, Input, Optional, Self} from '@angular/core';
import {NgModel} from '@angular/forms';
import {NgFormValidateDirective} from './ng-form-validate.directive';
import {DOCUMENT} from '@angular/common';
import {ValidateConfigService} from '../validate-config.service';
import {AbstractValidateElementDirective, VALIDATE_ELEMENT} from '../abstract-validate-element.directive';

@Directive({
    selector: '[ngModel]',
    providers: [
        {
            provide: VALIDATE_ELEMENT,
            useExisting: NgModelValidateDirective
        }
    ]
})
export class NgModelValidateDirective extends AbstractValidateElementDirective {
    @Input() errorMessage?: Record<string, string>;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(
        protected elementRef: ElementRef<HTMLElement | HTMLInputElement>,
        protected config: ValidateConfigService,
        @Self() protected ngControl: NgModel,
        @Optional() protected ngFormValidate: NgFormValidateDirective,
        @Inject(DOCUMENT) protected document: Document,
    ) {
        super();
    }
}
