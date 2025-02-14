import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearIPMPageRoutingModule } from './crear-ipm-routing.module';

import { CrearIPMPage } from './crear-ipm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearIPMPageRoutingModule
  ],
  declarations: [CrearIPMPage]
})
export class CrearIPMPageModule {}
