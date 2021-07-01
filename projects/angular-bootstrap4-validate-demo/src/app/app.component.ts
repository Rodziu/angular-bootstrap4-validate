/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Validators} from 'angular-bootstrap4-validate';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    nav: { id: string, title: string }[] = [];

    basic = {
        first_name: 'Mark',
        last_name: 'Otto',
        username: '',
        gender: '',
        check: false,
        radio: ''
    };

    firstName = new FormControl('Mark', Validators.required);

    reactive = new FormGroup({
        first_name: this.firstName,
        last_name: new FormControl('Otto'),
        username: new FormControl('', Validators.required),
        gender: new FormControl('', Validators.required),
        check: new FormControl(false, Validators.requiredTrue),
        radioGroup: new FormGroup({
            radio: new FormControl('')
        }, Validators.requiredGroup())
    });

    tooltip = {
        first_name: 'Mark',
        last_name: 'Otto',
        username: '',
        gender: '',
        check: false,
        radio: ''
    };

    customError = '';
    customErrorReactive = new FormControl('', Validators.required);

    supportedValidators = {
        required: '',
        pattern: 'aaa',
        email: '123',
        ngRequired: '',
        ngMinlength: '1',
        ngMaxlength: '123',
        min: -1,
        max: 11,
    };
    required = true;

    additionalValidators = {
        number: '',
        numberReactive: new FormControl('aaa', Validators.number),
        url: 'not an url',
        urlReactive: new FormControl('not an url', Validators.url()),
        urlMultiple: 'http://example.com\nhttps://www.example.com',
        urlMultipleReactive: new FormControl(
            'http://example.com\nhttps://www.example.com', Validators.url('multiple')
        ),
        host: 'not a host',
        hostReactive: new FormControl('not a host', Validators.host()),
        hostMultiple: 'example.com\nwww.example.com',
        hostMultipleReactive: new FormControl('example.com\nwww.example.com', Validators.host('multiple')),
        equal1: '1',
        equal2: '2',
        equalGroup: new FormGroup({
            equal1: new FormControl('1'),
            equal2: new FormControl('2'),
        }, [Validators.equal('equal1', 'equal2')]),
        required1: false,
        required2: false,
        required3: false,
        required4: false,
        requiredFormGroup: new FormGroup({
            required1: new FormControl(false),
            required2: new FormControl(false),
        }, Validators.requiredGroup('or', true)),
        requiredFormGroup2: new FormGroup({
            required3: new FormControl(false),
            required4: new FormControl(false),
        }, Validators.requiredGroup('and', true)),
        custom: 'test'
    };

    nested = {
        first_name: 'Mark',
        last_name: '',
        username: '',
        gender: ''
    };
}
