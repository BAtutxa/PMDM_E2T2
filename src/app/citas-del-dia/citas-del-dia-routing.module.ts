import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasDelDiaPage } from './citas-del-dia.page';

const routes: Routes = [
  {
    path: '',
    component: CitasDelDiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasDelDiaPageRoutingModule {}
