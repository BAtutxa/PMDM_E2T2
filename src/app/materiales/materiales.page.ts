import { Component, OnInit, HostListener } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.page.html',
  styleUrls: ['./materiales.page.scss'],
})
export class MaterialesPage implements OnInit {
  mobilaDa: boolean = false;
  editandoMaterial: boolean = false;  // Para controlar si estamos editando
  materialSeleccionado: any = {};  // Para almacenar el material seleccionado

  materiales = [
    { id: 1, nombre: 'Shampoo', tipo: 'Higienea', marca: 'Edurne Senosiain', stock: 100 },
    { id: 2, nombre: 'Ile-egokitzailea', tipo: 'Higienea', marca: 'Natura Sibérica', stock: 50 },
    { id: 3, nombre: 'Lehorgailua', tipo: 'Herreminta', marca: 'GHD Helios', stock: 20 },
    { id: 4, nombre: 'Artaziak', tipo: 'Herreminta', marca: 'Filarmónica', stock: 30 },
    { id: 5, nombre: 'Krema', tipo: 'Higienea', marca: 'Magno Classic', stock: 75 }
  ];

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.mobilbista(); // Comprueba si es móvil al cargar
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilbista(); 
  }

  mobilbista() {
    this.mobilaDa = window.innerWidth <= 768; // Determina si el ancho de la pantalla es menor o igual a 768px
  }

  editarMaterial(material: any) {
    this.editandoMaterial = true;  // Activamos el modo de edición
    this.materialSeleccionado = { ...material };  // Copiamos los datos del material seleccionado
  }

  // Método para solicitar la edición de un campo
  async editarCampo(campo: string) {
    const alert = await this.alertController.create({
      header: `Aldatu ${campo}`,
      inputs: [
        {
          name: 'Balore berria',
          type: 'text',
          placeholder: `Balore berri bat eremu honetan: ${campo}`,
        },
      ],
      buttons: [
        {
          text: 'Kantzelatu',
          role: 'cancel',
        },
        {
          text: 'Konfirmatu',
          handler: (data) => {
            if (data.nuevoValor) {
              this.materialSeleccionado[campo] = data.nuevoValor;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para confirmar la edición
  async confirmarEdicion() {
    const alert = await this.alertController.create({
      header: '¿Seguru zaude?',
      message: 'Aldatuko dira baloreak',
      buttons: [
        {
          text: 'Kantzelatu',
          role: 'cancel',
        },
        {
          text: 'Konfirmatu',
          handler: () => {
            // Guardamos los cambios realizados
            const index = this.materiales.findIndex(material => material.id === this.materialSeleccionado.id);
            if (index !== -1) {
              this.materiales[index] = { ...this.materialSeleccionado };
            }
            this.editandoMaterial = false;  // Salimos del modo de edición
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para cancelar la edición
  cancelarEdicion() {
    this.editandoMaterial = false;  // Salimos del modo de edición sin guardar los cambios
  }
}
