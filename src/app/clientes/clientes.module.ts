import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ClientesPage } from './clientes.page';
import { ClientesPageRoutingModule } from './clientes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ClientesPageRoutingModule
  ],
  declarations: [ClientesPage],
})
export class ClientesPageModule {}
