import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { KoloreHistorialakPageRoutingModule } from './kolore-historialak-routing.module';
import { KoloreHistorialakPage } from './kolore-historialak.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KoloreHistorialakPageRoutingModule,
    TranslateModule
  ],
  declarations: [KoloreHistorialakPage]
})
export class KoloreHistorialakPageModule {}
