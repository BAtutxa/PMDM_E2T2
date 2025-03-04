import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriasPageRoutingModule } from './categorias-routing.module';

import { CategoriasPage } from './categorias.page';

import { TranslateModule } from '@ngx-translate/core';

import { NireKonponenteakModule } from '../nire-konponenteak/nire-konponenteak.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    NireKonponenteakModule,
    CategoriasPageRoutingModule,
  ],
  declarations: [CategoriasPage],
})
export class CategoriasPageModule {}
