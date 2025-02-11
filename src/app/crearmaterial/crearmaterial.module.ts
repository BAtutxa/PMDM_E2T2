import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearmaterialPageRoutingModule } from './crearmaterial-routing.module';

import { CrearmaterialPage } from './crearmaterial.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearmaterialPageRoutingModule,
    TranslateModule
  ],
  declarations: [CrearmaterialPage]
})
export class CrearmaterialPageModule {}
