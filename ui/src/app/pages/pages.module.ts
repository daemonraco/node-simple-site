import { CommonModule } from '@angular/common';
import { DRToolsModule } from 'ng-drtools';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        HomeComponent,
    ],
    exports: [
        HomeComponent,
    ],
    imports: [
        CommonModule,
        DRToolsModule,
    ],
})
export class PagesModule { }
