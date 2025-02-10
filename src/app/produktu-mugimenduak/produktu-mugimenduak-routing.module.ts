import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProduktuMugimenduakPage } from './produktu-mugimenduak.page';

const routes: Routes = [
  {
    path: '',
    component: ProduktuMugimenduakPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProduktuMugimenduakPageRoutingModule {}
