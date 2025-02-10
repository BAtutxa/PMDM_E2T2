import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialMaileguakPage } from './material-maileguak.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialMaileguakPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialMaileguakPageRoutingModule {}
