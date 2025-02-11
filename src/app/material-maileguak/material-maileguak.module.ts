import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialMaileguakPageRoutingModule } from './material-maileguak-routing.module';

import { MaterialMaileguakPage } from './material-maileguak.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialMaileguakPageRoutingModule,
    TranslateModule
  ],
  declarations: [MaterialMaileguakPage]
})
export class MaterialMaileguakPageModule {}
