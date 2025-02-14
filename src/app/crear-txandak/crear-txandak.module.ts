import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearTxandakPageRoutingModule } from './crear-txandak-routing.module';

import { CrearTxandakPage } from './crear-txandak.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearTxandakPageRoutingModule,
    TranslateModule
  ],
  declarations: [CrearTxandakPage]
})
export class CrearTxandakPageModule {}
