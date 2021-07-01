import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptRoutingModule } from './script-routing.module';
import { ScriptComponent } from './script.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';


@NgModule({
  declarations: [
    ScriptComponent
  ],
  imports: [
    CommonModule,
    ScriptRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forChild({ extras: { lazyRender: true } }),
    FormlyMaterialModule
  ]
})
export class ScriptModule { }
