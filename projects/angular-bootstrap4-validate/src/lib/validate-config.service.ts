/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */
import {Injectable} from '@angular/core';

export type validationMode = 'feedback' | 'tooltip';

@Injectable({
    providedIn: 'root'
})
export class ValidateConfigService {
    mode: validationMode = 'feedback';
    inputGroupFix = true;
    errorMessages: Record<string, string> = {
        required: 'This field is required',
        min: 'Minimum value is %s',
        max: 'Maximum value is %s',
        pattern: 'Please ensure the entered information adheres to this pattern: %s',
        number: 'Please enter a valid number',
        email: 'Please enter a valid e-mail',
        minlength: 'Minimum length of this field is %s characters',
        maxlength: 'Maximum length of this field is %s characters',
        equal: 'These fields needs to be equal',
        url: 'Please enter a valid URL (http(s)://example.com)',
        urlMultiple: 'Please enter valid URLs (http(s)://example.com), each one in new line!',
        host: 'Please enter valid host (example.com)',
        hostMultiple: 'Please enter valid hosts (example.com), each one in new line!',
        requiredGroupOr: 'At least one of these fields is required',
        requiredGroupAnd: 'All of these fields are required',
    };
}
