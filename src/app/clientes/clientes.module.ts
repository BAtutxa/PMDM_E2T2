import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ClientesPageRoutingModule } from './clientes-routing.module';
import { FormsModule } from '@angular/forms';
import { ClientesPage } from './clientes.page';
import { NireKonponenteakModule } from "../nire-konponenteak/nire-konponenteak.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ClientesPageRoutingModule,
    FormsModule,
    NireKonponenteakModule
],
  declarations: [ClientesPage]
})
export class ClientesPageModule {}
