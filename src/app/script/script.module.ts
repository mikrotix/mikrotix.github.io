import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ScriptRoutingModule } from './script-routing.module';
import { ScriptComponent } from './script.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { GenerateComponent } from './generate/generate.component';
import { RepeatTypeComponent } from './repeat-section.type';


@NgModule({
  declarations: [
    ScriptComponent,
    GenerateComponent,
    RepeatTypeComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ScriptRoutingModule,
    ReactiveFormsModule,
    FormlyModule.forChild({
      extras: { lazyRender: true },
      types: [{ name: 'repeat', component: RepeatTypeComponent }]
    }),
    FormlyMaterialModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    MatCardModule,
    MatButtonModule,
  ]
})
export class ScriptModule { }
