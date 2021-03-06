/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {
    ElementRef,
    Injectable,
    InjectionToken,
    KeyValueDiffer, KeyValueDiffers,
    OnDestroy,
    OnInit
} from '@angular/core';
import {AbstractControl, AbstractControlDirective} from '@angular/forms';
import {NgFormValidateDirective} from './template-forms/ng-form-validate.directive';
import {ValidateConfigService} from './validate-config.service';
import {Subject} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';

export interface IValidateAbstractControl extends AbstractControl {
    __elementValidity?: ValidityState;
    errorMessage?: Record<string, string>;
}

export const VALIDATE_ELEMENT = new InjectionToken('Validate element');

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export abstract class AbstractValidateElementDirective implements OnInit, OnDestroy {

    abstract errorMessage?: Record<string, string>;

    private feedbackElement?: HTMLElement;
    private differ?: KeyValueDiffer<string, unknown>;
    public errorMessages: string[] = [];

    protected abstract ngControl: AbstractControlDirective;
    protected abstract ngFormValidate: NgFormValidateDirective;
    protected abstract elementRef: ElementRef<HTMLElement | HTMLInputElement>;
    protected abstract document: Document;
    protected abstract config: ValidateConfigService;
    protected abstract keyValueDiffers: KeyValueDiffers;
    protected isGroup = false;
    protected hasFeedback = false;
    protected feedbackElementContainer?: HTMLElement;

    protected _destroy$ = new Subject<void>();

    // eslint-disable-next-line @angular-eslint/contextual-lifecycle
    ngOnInit(): void {
        if ('validity' in this.elementRef.nativeElement) {
            (this.ngControl.control as IValidateAbstractControl).__elementValidity
                = this.elementRef.nativeElement.validity;
        }
        if (!this.feedbackElementContainer && this.elementRef.nativeElement.classList.contains('form-group')) {
            this.feedbackElementContainer = this.elementRef.nativeElement;
        }
        this.ngControl.statusChanges
            ?.pipe(
                startWith(this.ngControl.status),
                takeUntil(this._destroy$)
            )
            .subscribe((status) => {
                if (!this.ngFormValidate) {
                    return;
                }

                if (
                    !this.isGroup
                    && this.ngControl.dirty
                    && (!this.config.displayOnTouched || this.ngControl.touched)
                    && !this.elementRef.nativeElement.classList.contains('ng-form')
                    && !this.elementRef.nativeElement.classList.contains('ignore-group-validation')
                ) {
                    (this.feedbackElementContainer || this.elementRef.nativeElement.parentElement)
                        ?.classList.add('was-validated');
                }

                if ( // prevent creating feedbackElement when it's not yet needed
                    !this.feedbackElement
                    && status === 'VALID'
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

                    this.differ = this.keyValueDiffers.find({}).create();
                }

                if (!this.differ?.diff(this.ngControl.errors || {})) {
                    return;
                }

                this.errorMessages.length = 0;
                if (this.ngControl.errors !== null) {
                    Object.entries(this.ngControl.errors || {})
                        .forEach(([error, errorValue]) => {
                            let msg = this.config.errorMessages[error];

                            if (
                                typeof this.errorMessage !== 'undefined'
                                && typeof this.errorMessage[error] !== 'undefined'
                            ) {
                                msg = this.errorMessage[error];
                            } else if (this.ngControl.control !== null) {
                                const control: IValidateAbstractControl = this.ngControl.control;

                                if (
                                    typeof control.errorMessage !== 'undefined'
                                    && typeof control.errorMessage[error] !== 'undefined'
                                ) {
                                    msg = control.errorMessage[error];
                                }
                            }

                            if (msg) {
                                this.errorMessages.push(
                                    msg.replace('%s', this.getErrorValue(error, errorValue))
                                );
                            }
                        });
                }

                this.feedbackElement.textContent = this.errorMessages.join(',');
                this.hasFeedback = !!this.errorMessages.length;
            });
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

    protected getErrorValue(error: string, errorValue: unknown): string {
        if (errorValue === null) {
            return '';
        }

        if (typeof errorValue === 'object') {
            if (error === 'minlength' || error === 'maxlength') {
                return (errorValue as Record<string, number>).requiredLength.toString();
            } else if (error === 'pattern') {
                return (errorValue as Record<string, string>).requiredPattern;
            }

            if (error in (errorValue as Record<string, unknown>)) {
                errorValue = (errorValue as Record<string, unknown>)[error];
            }
        }

        switch (typeof errorValue) {
            case 'number':
                return errorValue.toString();
            case 'string':
                return errorValue;
            case 'undefined':
            case 'boolean':
            case 'function':
            case 'symbol':
            default:
                return '';
        }
    }
}
