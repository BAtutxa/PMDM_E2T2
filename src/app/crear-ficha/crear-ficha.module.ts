import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearFichaPageRoutingModule } from './crear-ficha-routing.module';

import { CrearFichaPage } from './crear-ficha.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearFichaPageRoutingModule,
    TranslateModule
  ],
  declarations: [CrearFichaPage]
})
export class CrearFichaPageModule {}
