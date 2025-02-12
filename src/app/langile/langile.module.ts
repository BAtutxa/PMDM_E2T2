import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LangilePageRoutingModule } from './langile-routing.module';

import { LangilePage } from './langile.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LangilePageRoutingModule
  ],
  declarations: [LangilePage]
})
export class LangilePageModule {}
