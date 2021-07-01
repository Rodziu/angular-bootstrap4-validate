/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SectionDirective} from './section.directive';
import {ValidateModule} from 'angular-bootstrap4-validate';

@NgModule({
    declarations: [
        AppComponent,
        SectionDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        ValidateModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
