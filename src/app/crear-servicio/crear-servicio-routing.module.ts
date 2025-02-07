import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearServicioPage } from './crear-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: CrearServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearServicioPageRoutingModule {}
