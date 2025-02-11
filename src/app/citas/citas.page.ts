import { LangileakService } from 'src/app/services/Langileak.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ITrabajador } from '../interfaces/ITrabajador';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit {
  citaForm: FormGroup;
  fechaSeleccionada: string = ''; // Variable para almacenar la fecha seleccionada
  langileakList: ITrabajador[] = []; // Lista para almacenar los Langileak

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private langileakService: LangileakService
  ) {
    this.citaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.pattern('^[0-9]+$')]], // Ya no es obligatorio
      hora: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?:[01]?[0-9]|2[0-3]):([0-5]?[0-9])$'),
        ],
      ],
      eslekua: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      deskribapena: [''], // Ya no es obligatorio
      etxekoa: ['', [Validators.required]],
      prezioa: ['', [Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')]], // Ya no es obligatorio
      langilea: ['', [Validators.required]], // Campo obligatorio para Langilea
      horaFin: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?:[01]?[0-9]|2[0-3]):([0-5]?[0-9])$'),
        ],
      ],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.fechaSeleccionada = params['fecha'] || 'Fecha no seleccionada';
      console.log('Fecha recibida:', this.fechaSeleccionada);
    });

    // Obtener los Langileak
    this.langileakService.getLangileak().subscribe(
      (data) => {
        this.langileakList = data;
        console.log('Langileak obtenidos:', this.langileakList);
      },
      (error) => {
        console.error('Error al obtener Langileak:', error);
      }
    );
  }

  onLangileaChange(event: any) {
    const langileaId = event.detail.value; // Obtener el ID del Langilea seleccionado
    this.citaForm.patchValue({ langilea: langileaId }); // Establecer el ID en el formulario
  }

  async confirmarCita() {
    if (this.citaForm.valid) {
      const datos = this.citaForm.value;
  
      // Verificar que el campo 'eslekua' no sea mayor a 5
      if (datos.eslekua > 5) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'El campo "Eslekua" debe ser menor o igual a 5.',
          buttons: ['OK'],
        });
        await alert.present();
        return; // Detener la ejecución si hay un error
      }
  
      this.navCtrl.navigateForward(['/confirmar-cita'], {
        queryParams: {
          nombre: datos.nombre,
          telefono: datos.telefono,
          hora: datos.hora,
          fecha: this.fechaSeleccionada,
          eslekua: datos.eslekua,
          deskribapena: datos.deskribapena,
          etxekoa: datos.etxekoa,
          prezioa: datos.prezioa,
          langilea: datos.langilea,
          horaFin: datos.horaFin,
        },
      });
    } else {
      let errorMessage = 'Por favor, rellena todos los campos correctamente.';
  
      if (this.citaForm.get('nombre')?.invalid) {
        errorMessage = 'El campo "Nombre" es obligatorio.';
      } else if (this.citaForm.get('hora')?.invalid) {
        errorMessage = 'Por favor, ingresa una hora válida (ejemplo: 14:30).';
      }
  
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  
descartarCita() {
  this.citaForm.reset();
  this.router.navigate(['/calendario']);}
}