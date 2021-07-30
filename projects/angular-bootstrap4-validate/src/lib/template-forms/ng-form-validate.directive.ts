/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {
    ContentChildren,
    Directive,
    ElementRef,
    Host,
    Inject,
    Input,
    Optional,
    QueryList,
    Self,
    SkipSelf
} from '@angular/core';
import {AbstractControlDirective, FormGroupDirective, FormGroupName, NgForm} from '@angular/forms';
import {ValidateConfigService} from '../validate-config.service';
import {AbstractValidateElementDirective} from '../abstract-validate-element.directive';
import {DOCUMENT} from '@angular/common';

@Directive({
    selector: 'form:not([ngNoForm]),ng-form,[ngForm],[formGroup],[formGroupName]',
    exportAs: 'ngFormValidate'
})
export class NgFormValidateDirective extends AbstractValidateElementDirective {
    @Input() validateMode: 'feedback' | 'tooltip';
    @Input() errorMessage?: Record<string, string>;

    @ContentChildren(NgFormValidateDirective, {descendants: true})
    private children!: QueryList<NgFormValidateDirective>;

    wasValidated: boolean;

    protected ngFormValidate = this;
    protected ngControl: AbstractControlDirective;
    protected isGroup = true;

    constructor(
        @Self() @Optional() @Host() protected ngForm: NgForm,
        @Self() @Optional() @Host() protected formGroup: FormGroupDirective,
        @Self() @Optional() @Host() protected formGroupName: FormGroupName,
        @SkipSelf() @Optional() @Host() protected parent: NgFormValidateDirective,
        protected config: ValidateConfigService,
        protected elementRef: ElementRef<HTMLFormElement>,
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
