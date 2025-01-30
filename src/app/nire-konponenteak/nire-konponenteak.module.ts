import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuHeaderComponent } from './menu-header/menu-header.component';

@NgModule({
  declarations: [MenuHeaderComponent],
  imports: [
    CommonModule, IonicModule
  ],
  exports: [MenuHeaderComponent]
})
export class NireKonponenteakModule { }
