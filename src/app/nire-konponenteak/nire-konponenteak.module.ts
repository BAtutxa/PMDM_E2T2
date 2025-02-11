import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuHeaderComponent } from './menu-header/menu-header.component';

// Importa TranslateModule
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MenuHeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    TranslateModule.forChild()
  ],
  exports: [MenuHeaderComponent]
})
export class NireKonponenteakModule { }
