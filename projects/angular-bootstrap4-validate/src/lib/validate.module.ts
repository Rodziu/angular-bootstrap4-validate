/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {NgModule} from '@angular/core';
import {NgModelValidateDirective} from './template-forms/ng-model-validate.directive';
import {NgFormValidateDirective} from './template-forms/ng-form-validate.directive';
import {FormControlNameValidateDirective} from './reactive-forms/form-control-name-validate.directive';
import {FormControlValidateDirective} from './reactive-forms/form-control-validate.directive';
import {ValidatorsModule} from './validators/validators.module';

@NgModule({
    declarations: [
        FormControlNameValidateDirective,
        FormControlValidateDirective,
        NgFormValidateDirective,
        NgModelValidateDirective
    ],
    imports: [
        ValidatorsModule
    ],
    exports: [
        FormControlNameValidateDirective,
        FormControlValidateDirective,
        NgFormValidateDirective,
        NgModelValidateDirective,
        ValidatorsModule
    ]
})
export class ValidateModule {

}
