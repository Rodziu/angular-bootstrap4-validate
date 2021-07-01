/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {AfterViewChecked, ElementRef, Injectable, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, AbstractControlDirective} from '@angular/forms';
import {NgFormValidateDirective} from './template-forms/ng-form-validate.directive';
import {ValidateConfigService} from './validate-config.service';

export interface IValidateAbstractControl extends AbstractControl {
    __elementValidity?: ValidityState;
}

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export abstract class AbstractValidateElementDirective implements AfterViewChecked, OnDestroy, OnInit {

    abstract errorMessage?: Record<string, string>;

    private feedbackElement?: HTMLElement;
    public errorMessages: string[] = [];

    protected abstract ngControl: AbstractControlDirective;
    protected abstract ngFormValidate: NgFormValidateDirective;
    protected abstract elementRef: ElementRef<HTMLElement | HTMLInputElement>;
    protected abstract document: Document;
    protected abstract config: ValidateConfigService;
    protected isGroup = false;
    protected feedbackElementContainer?: HTMLElement;

    // eslint-disable-next-line @angular-eslint/contextual-lifecycle
    ngOnInit(): void {
        if ('validity' in this.elementRef.nativeElement) {
            (this.ngControl.control as IValidateAbstractControl).__elementValidity
                = this.elementRef.nativeElement.validity;
        }
    }

    // eslint-disable-next-line @angular-eslint/contextual-lifecycle
    ngAfterViewChecked(): void {
        if (!this.ngFormValidate) {
            return;
        }

        if (!this.isGroup && this.ngControl.dirty) {
            this.elementRef.nativeElement.parentElement?.classList.add('was-validated');
        }

        if ( // prevent creating feedbackElement when its not yet needed
            !this.feedbackElement
            && this.ngControl.valid
        ) {
            return;
        }

        if (!this.feedbackElement) {
            const feedbackElement = this.createFeedBackElement();
            if (!feedbackElement) {
                return;
            }
            this.feedbackElement = feedbackElement;
            if (this.config.inputGroupFix) {
                this.inputGroupFix();
            }
        }

        this.errorMessages.length = 0;
        if (this.ngControl.errors !== null) {
            Object.keys(this.ngControl.errors || [])
                .forEach((error) => {
                    let msg = this.config.errorMessages[error];
                    if (
                        typeof this.errorMessage !== 'undefined'
                        && typeof this.errorMessage[error] !== 'undefined'
                    ) {
                        msg = this.errorMessage[error];
                    }

                    if (msg) {
                        const value = this.elementRef.nativeElement.getAttribute(error) || '';
                        this.errorMessages.push(
                            msg.replace('%s', value)
                        );
                    }
                });
        }

        this.feedbackElement.textContent = this.errorMessages.join(',');
    }

    ngOnDestroy(): void {
        if (this.feedbackElement) {
            this.feedbackElement.remove();
        }
    }

    protected createFeedBackElement(): HTMLElement | null {
        const parent = this.feedbackElementContainer || this.elementRef.nativeElement.parentNode;
        if (parent) {
            const feedbackElement = this.document.createElement('div');
            feedbackElement.classList.add(`invalid-${this.ngFormValidate.validateMode}`);

            parent.appendChild(feedbackElement);

            return feedbackElement;
        }
        return null;
    }

    protected inputGroupFix(): void {
        const parent = this.elementRef.nativeElement.parentElement;
        if (parent) {
            if (parent.classList.contains('input-group')) {
                this.feedbackElement?.previousElementSibling?.classList.add('rounded-right');
            } else {

                this.feedbackElement?.previousElementSibling?.classList.remove('rounded-right');
            }
        }
    }
}
