import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearGruposPage } from './crear-grupos.page';

const routes: Routes = [
  {
    path: '',
    component: CrearGruposPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearGruposPageRoutingModule {}
