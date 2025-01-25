import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarGrupoPage } from './editar-grupo.page';

const routes: Routes = [
  {
    path: '',
    component: EditarGrupoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarGrupoPageRoutingModule {}
