/*
 * Angular validation plugin for  Bootstrap 4
 *  Copyright (c) 2019-2021 Rodziu <mateusz.rohde@gmail.com>
 *  License: MIT
 */

import {Directive, ElementRef, Host, Input, OnInit} from '@angular/core';
import {AppComponent} from './app.component';

@Directive({
    selector: 'section',
})
export class SectionDirective implements OnInit {
    @Input() id = '';

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        @Host() private app: AppComponent
    ) {
    }

    ngOnInit(): void {
        this.app.nav.push({
            id: this.id,
            title: this.elementRef.nativeElement.querySelector('.page-header')?.textContent?.trim() || this.id
        });
    }
}
