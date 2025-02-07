import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearmaterialPageRoutingModule } from './crearmaterial-routing.module';

import { CrearmaterialPage } from './crearmaterial.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearmaterialPageRoutingModule
  ],
  declarations: [CrearmaterialPage]
})
export class CrearmaterialPageModule {}
