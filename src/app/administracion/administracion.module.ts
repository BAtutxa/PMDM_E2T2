import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministracionPageRoutingModule } from './administracion-routing.module';

import { AdministracionPage } from './administracion.page';
import { NireKonponenteakModule } from '../nire-konponenteak/nire-konponenteak.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministracionPageRoutingModule,
    NireKonponenteakModule,
    TranslateModule
  ],
  declarations: [AdministracionPage]
})
export class AdministracionPageModule {}
