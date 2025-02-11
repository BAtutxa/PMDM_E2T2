import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearServicioPageRoutingModule } from './crear-servicio-routing.module';

import { CrearServicioPage } from './crear-servicio.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearServicioPageRoutingModule,
    TranslateModule
  ],
  declarations: [CrearServicioPage]
})
export class CrearServicioPageModule {}
