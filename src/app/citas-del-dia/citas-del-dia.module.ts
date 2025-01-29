import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitasDelDiaPageRoutingModule } from './citas-del-dia-routing.module';

import { CitasDelDiaPage } from './citas-del-dia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitasDelDiaPageRoutingModule
  ],
  declarations: [CitasDelDiaPage]
})
export class CitasDelDiaPageModule {}
