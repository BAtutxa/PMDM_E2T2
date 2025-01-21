import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfirmarCitaPage } from './confirmar-cita.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmarCitaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmarCitaPageRoutingModule {}
