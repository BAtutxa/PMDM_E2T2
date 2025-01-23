import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearFichaPageRoutingModule } from './crear-ficha-routing.module';

import { CrearFichaPage } from './crear-ficha.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearFichaPageRoutingModule
  ],
  declarations: [CrearFichaPage]
})
export class CrearFichaPageModule {}
