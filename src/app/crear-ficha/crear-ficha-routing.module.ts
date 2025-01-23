import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearFichaPage } from './crear-ficha.page';

const routes: Routes = [
  {
    path: '',
    component: CrearFichaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearFichaPageRoutingModule {}
