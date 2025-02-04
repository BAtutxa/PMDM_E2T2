import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialaPageRoutingModule } from './historiala-routing.module';

import { HistorialaPage } from './historiala.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialaPageRoutingModule
  ],
  declarations: [HistorialaPage]
})
export class HistorialaPageModule {}
