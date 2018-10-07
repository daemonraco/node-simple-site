import { BrowserModule } from '@angular/platform-browser';
import { DRToolsModule } from 'ng-drtools';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { NavComponent } from './directives/nav/nav.component';

import { AppInitFactory } from './app.init';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        NavComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        DRToolsModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: AppInitFactory,
            deps: [
            ],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
