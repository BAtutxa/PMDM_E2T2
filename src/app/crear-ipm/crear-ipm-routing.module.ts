import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearIPMPage } from './crear-ipm.page';

const routes: Routes = [
  {
    path: '',
    component: CrearIPMPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearIPMPageRoutingModule {}
