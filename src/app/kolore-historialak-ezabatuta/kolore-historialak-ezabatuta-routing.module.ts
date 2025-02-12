import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KoloreHistorialakEzabatutaPage } from './kolore-historialak-ezabatuta.page';

const routes: Routes = [
  {
    path: '',
    component: KoloreHistorialakEzabatutaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KoloreHistorialakEzabatutaPageRoutingModule {}
