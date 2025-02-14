import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialaPageRoutingModule } from './historiala-routing.module';

import { HistorialaPage } from './historiala.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialaPageRoutingModule,
    TranslateModule
  ],
  declarations: [HistorialaPage]
})
export class HistorialaPageModule {}
