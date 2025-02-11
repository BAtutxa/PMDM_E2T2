import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductosPageRoutingModule } from './productos-routing.module';

import { ProductosPage } from './productos.page';
import { NireKonponenteakModule } from '../nire-konponenteak/nire-konponenteak.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductosPageRoutingModule,
    NireKonponenteakModule,
    TranslateModule,
    TranslateModule.forChild()
  ],
  declarations: [ProductosPage]
})
export class ProductosPageModule {}
