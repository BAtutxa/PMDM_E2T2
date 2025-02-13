import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdutegiPageRoutingModule } from './ordutegi-routing.module';

import { OrdutegiPage } from './ordutegi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdutegiPageRoutingModule
  ],
  declarations: [OrdutegiPage]
})
export class OrdutegiPageModule {}
