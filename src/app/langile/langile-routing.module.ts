import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LangilePage } from './langile.page';

const routes: Routes = [
  {
    path: '',
    component: LangilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LangilePageRoutingModule {}
