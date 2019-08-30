import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import { CustomInputDirective } from './directives/custom-input.directive';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { CustomFormComponent } from './custom-form/custom-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomInputDirective,
    CustomInputComponent,
    CustomFormComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
