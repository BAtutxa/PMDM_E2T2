import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KoloreHistorialakEzabatutaPageRoutingModule } from './kolore-historialak-ezabatuta-routing.module';

import { KoloreHistorialakEzabatutaPage } from './kolore-historialak-ezabatuta.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KoloreHistorialakEzabatutaPageRoutingModule,
    TranslateModule
  ],
  declarations: [KoloreHistorialakEzabatutaPage]
})
export class KoloreHistorialakEzabatutaPageModule {}
