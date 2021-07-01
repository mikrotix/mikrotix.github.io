import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateComponent } from './generate/generate.component';
import { ScriptComponent } from './script.component';

const routes: Routes = [
  { path: 'generate/:script', component: GenerateComponent },
  { path: '', component: ScriptComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScriptRoutingModule { }
