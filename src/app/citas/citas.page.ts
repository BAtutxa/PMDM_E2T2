import { LangileakService } from 'src/app/services/Langileak.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ITrabajador } from '../interfaces/ITrabajador';
import { TranslateService } from '@ngx-translate/core';

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
  private langileakService: LangileakService,
  private translate: TranslateService // <-- Agregado
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
  
      if (datos.eslekua > 5) {
        const alert = await this.alertCtrl.create({
          header: this.translate.instant('ERROR.TITLE'),
          message: this.translate.instant('ERROR.ESLEKUA_MAX'),
          buttons: ['OK'],
        });
        await alert.present();
        return;
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
      let errorMessage = this.translate.instant('ERROR.FILL_FIELDS');
  
      if (this.citaForm.get('nombre')?.invalid) {
        errorMessage = this.translate.instant('ERROR.NAME_REQUIRED');
      } else if (this.citaForm.get('hora')?.invalid) {
        errorMessage = this.translate.instant('ERROR.INVALID_TIME');
      }
  
      const alert = await this.alertCtrl.create({
        header: this.translate.instant('ERROR.TITLE'),
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