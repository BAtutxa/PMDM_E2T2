import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfirmarCitaPageRoutingModule } from './confirmar-cita-routing.module';

import { ConfirmarCitaPage } from './confirmar-cita.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfirmarCitaPageRoutingModule
  ],
  declarations: [ConfirmarCitaPage]
})
export class ConfirmarCitaPageModule {}
