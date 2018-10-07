import { CommonModule } from '@angular/common';
import { DRToolsModule } from 'ng-drtools';
import { NgModule } from '@angular/core';

import { NavComponent } from './nav/nav.component';

@NgModule({
    declarations: [
        NavComponent,
    ],
    exports: [
        NavComponent,
    ],
    imports: [
        CommonModule,
        DRToolsModule,
    ],
})
export class BasicsModule { }
