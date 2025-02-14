import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearMaileguakPageRoutingModule } from './crear-maileguak-routing.module';

import { CrearMaileguakPage } from './crear-maileguak.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearMaileguakPageRoutingModule
  ],
  declarations: [CrearMaileguakPage]
})
export class CrearMaileguakPageModule {}
