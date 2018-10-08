import { CommonModule } from '@angular/common';
import { DRToolsModule } from 'ng-drtools';
import { NgModule } from '@angular/core';

import { HomeComponent } from './home/home.component';

import { PagesRoutingModule } from './pages-routing.module';

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
        PagesRoutingModule,
    ],
})
export class PagesModule { }
