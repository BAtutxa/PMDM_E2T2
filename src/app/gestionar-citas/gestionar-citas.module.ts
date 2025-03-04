import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarCitasPageRoutingModule } from './gestionar-citas-routing.module';

import { GestionarCitasPage } from './gestionar-citas.page';
import { NireKonponenteakModule } from "../nire-konponenteak/nire-konponenteak.module";

import { TranslateModule } from '@ngx-translate/core';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarCitasPageRoutingModule,
    NireKonponenteakModule,
    ReactiveFormsModule,
    TranslateModule
],
  declarations: [GestionarCitasPage]
})
export class GestionarCitasPageModule {}
