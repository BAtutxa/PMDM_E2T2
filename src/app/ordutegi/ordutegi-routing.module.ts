import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdutegiPage } from './ordutegi.page';

const routes: Routes = [
  {
    path: '',
    component: OrdutegiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdutegiPageRoutingModule {}
