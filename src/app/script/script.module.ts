import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptRoutingModule } from './script-routing.module';
import { ScriptComponent } from './script.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { LoadBalanceNthComponent } from './load-balance-nth/load-balance-nth.component';


@NgModule({
  declarations: [
    ScriptComponent,
    LoadBalanceNthComponent
  ],
  imports: [
    CommonModule,
    ScriptRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forChild({ extras: { lazyRender: true } },),
    FormlyMaterialModule,
    MatCardModule,
    MatButtonModule,
  ]
})
export class ScriptModule { }
