/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {
    ContentChildren,
    Directive,
    ElementRef,
    HostBinding,
    Inject,
    Input, KeyValueDiffers,
    Optional,
    QueryList,
    Self,
    SkipSelf
} from '@angular/core';
import {AbstractControlDirective, FormGroupDirective, FormGroupName, NgForm} from '@angular/forms';
import {ValidateConfigService} from '../validate-config.service';
import {AbstractValidateElementDirective, VALIDATE_ELEMENT} from '../abstract-validate-element.directive';
import {DOCUMENT} from '@angular/common';

@Directive({
    selector: 'form:not([ngNoForm]),ng-form,[ngForm],[formGroup],[formGroupName]',
    exportAs: 'ngFormValidate',
    providers: [
        {
            provide: VALIDATE_ELEMENT,
            useExisting: NgFormValidateDirective
        }
    ]
})
export class NgFormValidateDirective extends AbstractValidateElementDirective {
    @Input() validateMode: 'feedback' | 'tooltip';
    @Input() errorMessage?: Record<string, string>;

    @HostBinding('class.ng-form') ngFormCss = true;
    @HostBinding('class.has-validate-feedback') protected hasFeedback = false;

    @ContentChildren(NgFormValidateDirective, {descendants: true})
    private children!: QueryList<NgFormValidateDirective>;

    wasValidated: boolean;

    protected ngFormValidate = this;
    protected ngControl: AbstractControlDirective;
    protected isGroup = true;

    constructor(
        @Self() @Optional() protected ngForm: NgForm,
        @Self() @Optional() protected formGroup: FormGroupDirective,
        @Self() @Optional() protected formGroupName: FormGroupName,
        @SkipSelf() @Optional() protected parent: NgFormValidateDirective,
        protected config: ValidateConfigService,
        protected elementRef: ElementRef<HTMLFormElement>,
        protected keyValueDiffers: KeyValueDiffers,
        @Inject(DOCUMENT) protected document: Document
    ) {
        super();
        this.validateMode = config.mode;
        this.wasValidated = elementRef.nativeElement.classList.contains('was-validated');
        this.feedbackElementContainer = this.elementRef.nativeElement;
        this.ngControl = this.ngForm || this.formGroup || this.formGroupName;
        (this.ngForm || this.formGroup)?.ngSubmit.subscribe(() => {
            this.showValidation();
        })
    }

    showValidation(): void {
        this.elementRef.nativeElement.classList.add('was-validated');
        this.wasValidated = true;
    }

    resetValidation(): void {
        if (this.parent) {
            this.parent.resetValidation();
            return;
        }

        this.children.forEach((child) => {
            const form = child.formGroupName
                ? child.formGroupName.formDirective?.getFormGroup(child.formGroupName)
                : (child.ngForm || child.formGroup).form;
            form?.markAsPristine();
        });

        this.elementRef.nativeElement.querySelectorAll('.was-validated')
            .forEach((node) => {
                node.classList.remove('was-validated');
            });
        this.elementRef.nativeElement.classList.remove('was-validated');
        this.wasValidated = false;
    }
}
