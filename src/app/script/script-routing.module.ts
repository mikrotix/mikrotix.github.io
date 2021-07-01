import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadBalanceNthComponent } from './load-balance-nth/load-balance-nth.component';
import { ScriptComponent } from './script.component';

const routes: Routes = [
  { path: 'nth', component: LoadBalanceNthComponent },
  { path: '', component: ScriptComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScriptRoutingModule { }
