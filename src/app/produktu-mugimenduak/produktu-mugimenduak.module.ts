import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProduktuMugimenduakPageRoutingModule } from './produktu-mugimenduak-routing.module';

import { ProduktuMugimenduakPage } from './produktu-mugimenduak.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProduktuMugimenduakPageRoutingModule
  ],
  declarations: [ProduktuMugimenduakPage]
})
export class ProduktuMugimenduakPageModule {}
