import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarGrupoPageRoutingModule } from './editar-grupo-routing.module';

import { EditarGrupoPage } from './editar-grupo.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarGrupoPageRoutingModule,
    TranslateModule
  ],
  declarations: [EditarGrupoPage]
})
export class EditarGrupoPageModule {}
