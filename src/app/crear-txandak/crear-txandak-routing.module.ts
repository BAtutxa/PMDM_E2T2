import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearTxandakPage } from './crear-txandak.page';

const routes: Routes = [
  {
    path: '',
    component: CrearTxandakPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearTxandakPageRoutingModule {}
