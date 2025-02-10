import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitasPageRoutingModule } from './citas-routing.module';

import { CitasPage } from './citas.page';

import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // ¡Asegúrate de incluir esto!
    IonicModule,
    CitasPageRoutingModule,
    TranslateModule
  ],
  declarations: [CitasPage],
})
export class CitasPageModule {}
