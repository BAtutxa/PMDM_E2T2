import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearOrdutegiPage } from './crear-ordutegi.page';

const routes: Routes = [
  {
    path: '',
    component: CrearOrdutegiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearOrdutegiPageRoutingModule {}
