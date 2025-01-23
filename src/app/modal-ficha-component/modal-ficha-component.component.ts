import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IBezero } from '../interfaces/IEBezero';

@Component({
  selector: 'app-modal-ficha',
  templateUrl: './modal-ficha-component.component.html', 
  styleUrls: ['./modal-ficha-component.component.scss'] 
})
export class ModalFichaComponent {
  ficha: IBezero = {
    id: 0,
    izena: '', 
    abizena: '', 
    azal_sentikorra: '',
    telefonoa: 0,
    data: {
      sortze_data: new Date(), 
      eguneratze_data: new Date(),  
      ezabatze_data: new Date()  
    }
  };

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  async confirmar() {
    if (this.ficha.izena && this.ficha.abizena) {  
      console.log('Datos recibidos:', this.ficha); 
      await this.modalController.dismiss(this.ficha); 
    } else {
      console.log('Por favor, completa los campos requeridos.');
    }
  }
}
