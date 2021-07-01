/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {NgModule} from '@angular/core';
import {EqualValidatorDirective} from './equal-validator.directive';
import {HostValidatorDirective} from './host-validator.directive';
import {NumberValidatorDirective} from './number-validator.directive';
import {UrlValidatorDirective} from './url-validator.directive';
import {RequiredGroupValidatorDirective} from './required-group-validator.directive';

@NgModule({
    declarations: [
        EqualValidatorDirective,
        HostValidatorDirective,
        NumberValidatorDirective,
        RequiredGroupValidatorDirective,
        UrlValidatorDirective,
    ],
    exports: [
        EqualValidatorDirective,
        HostValidatorDirective,
        NumberValidatorDirective,
        RequiredGroupValidatorDirective,
        UrlValidatorDirective,
    ]
})
export class ValidatorsModule {
}
