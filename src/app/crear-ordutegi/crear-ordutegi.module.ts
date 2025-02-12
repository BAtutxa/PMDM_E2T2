import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearOrdutegiPageRoutingModule } from './crear-ordutegi-routing.module';

import { CrearOrdutegiPage } from './crear-ordutegi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearOrdutegiPageRoutingModule
  ],
  declarations: [CrearOrdutegiPage]
})
export class CrearOrdutegiPageModule {}
