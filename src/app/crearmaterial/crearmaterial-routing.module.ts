import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearmaterialPage } from './crearmaterial.page';

const routes: Routes = [
  {
    path: '',
    component: CrearmaterialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearmaterialPageRoutingModule {}
