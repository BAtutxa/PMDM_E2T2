import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GruposPageRoutingModule } from './grupos-routing.module';
import { GruposPage } from './grupos.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GruposPageRoutingModule,
    TranslateModule
  ],
  declarations: [GruposPage]
})
export class GruposPageModule {}
