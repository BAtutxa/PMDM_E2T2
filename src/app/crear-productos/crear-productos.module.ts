import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearProductosPageRoutingModule } from './crear-productos-routing.module';

import { CrearProductosPage } from './crear-productos.page';

import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearProductosPageRoutingModule,
    TranslateModule
  ],
  declarations: [CrearProductosPage]
})
export class CrearProductosPageModule {}
