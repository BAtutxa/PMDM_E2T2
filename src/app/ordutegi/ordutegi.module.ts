import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdutegiPageRoutingModule } from './ordutegi-routing.module';

import { OrdutegiPage } from './ordutegi.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrdutegiPageRoutingModule,
    TranslateModule
    ],
  declarations: [OrdutegiPage]
})
export class OrdutegiPageModule {}
