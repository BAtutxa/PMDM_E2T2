import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KoloreHistorialakPage } from './kolore-historialak.page';

const routes: Routes = [
  {
    path: '',
    component: KoloreHistorialakPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KoloreHistorialakPageRoutingModule {}
