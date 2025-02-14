import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TxandakPageRoutingModule } from './txandak-routing.module';

import { TxandakPage } from './txandak.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TxandakPageRoutingModule,
    TranslateModule
  ],
  declarations: [TxandakPage]
})
export class TxandakPageModule {}
