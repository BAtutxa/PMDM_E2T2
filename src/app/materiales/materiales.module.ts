import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialesPageRoutingModule } from './materiales-routing.module';

import { MaterialesPage } from './materiales.page';
import { NireKonponenteakModule } from '../nire-konponenteak/nire-konponenteak.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialesPageRoutingModule,
    NireKonponenteakModule,
    TranslateModule
    
  ],
  declarations: [MaterialesPage]
})
export class MaterialesPageModule {}
