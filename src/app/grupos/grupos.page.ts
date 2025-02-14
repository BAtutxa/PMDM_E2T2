import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoService } from './../services/equipos.service';
import { IEquipos } from './../interfaces/IEquipos';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { LangileakService } from '../services/Langileak.service';
import { ITrabajador } from '../interfaces/ITrabajador';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core'; // Importar el servicio de traducción

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {

  equipos: IEquipos[] = [];
  equipo: IEquipos = { 
    langileak: [],
    kodea: '',     
    izena: '',    
    data: {
      sortze_data: null,
      eguneratze_data: null,
      ezabatze_data: null
    }        
  }; 
  trabajadores: ITrabajador[] = []; 
  grupoId: string | undefined; 
  
  langileSeleccionado: ITrabajador = {
    kodea: '',
    id: null,
    izena: '',
    abizenak: '',
    data: {
      sortze_data: null,
      eguneratze_data: null,
      ezabatze_data: null,
    },
  }; 
  mostrarEditor: boolean = false; 
  grupo: any;

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
    private equipoService: EquipoService,
    private alertController: AlertController,
    private langileakService: LangileakService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService // Inyectar TranslateService
  ) {}

  goToTxandak(event: Event) {
    event.stopPropagation(); // Previene que el menú se cierre
    this.router.navigate(['/txandak']); // Navega manualmente al calendario
    this.menuCtrl.open(); // Abre el menú si es necesario
  }

  goToOrdutegi(event: Event) {
    event.stopPropagation(); // Previene que el menú se cierre
    this.router.navigate(['/ordutegi']); // Navega manualmente al calendario
    this.menuCtrl.open(); // Abre el menú si es necesario
  }

  ngOnInit(): void {
    this.grupoId = this.activatedRoute.snapshot.paramMap.get('kodea')!;
    this.cargarGrupos();
    this.cargarTrabajadores();
  }

  editarLangile(trabajador: ITrabajador) {
    this.langileSeleccionado = { ...trabajador }; // Clona el objeto seleccionado
    this.mostrarEditor = true;
  }
  
  guardarCambios() {
    this.langileakService.actualizarLangile(this.langileSeleccionado).subscribe();
    alert(this.translate.instant('success.message'));
    window.location.reload();
    this.mostrarEditor = false;
  }
  
  cancelarEdicion() {
    this.mostrarEditor = false; 
  }
  
  cargarGrupos(): void {
    this.equipoService.grupos$.subscribe({
      next: (grupos) => {
        this.equipos = grupos;
        console.log('Grupos cargados:', grupos);

        const grupo = this.equipos.find(grupo => grupo.kodea === this.grupoId);
        if (grupo) {
          this.equipo = { ...grupo }; 
        } else {
          console.error('Grupo no encontrado con el ID:', this.grupoId);
        }
      },
      error: (err) => {
        console.error('Error al cargar los grupos:', err);
      },
    });
  }

  cargarTrabajadores() {
    this.langileakService.getLangileak().subscribe(trabajadores => {
      this.trabajadores = trabajadores;
    });
  }

  async eliminarGrupo(grupo: IEquipos): Promise<void> {
    const alert = await this.alertController.create({
      header: this.translate.instant('confirmDelete.header'),
      message: this.translate.instant('confirmDelete.message'),
      buttons: [
        {
          text: this.translate.instant('confirmDelete.cancel'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('confirmDelete.confirm'),
          handler: async () => {
            const now = new Date();
            grupo.data = grupo.data || {};
            grupo.data.ezabatze_data = now;

            try {
              await firstValueFrom(this.equipoService.eliminarGrupo(grupo));
              this.equipos = this.equipos.filter((borrado) => borrado.kodea !== grupo.kodea);
            } catch (error) {
              console.error('Error al eliminar el grupo:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async CrearEquipo() {
    const alert = await this.alertController.create({
      header: this.translate.instant('createTeam.header'),
      message: this.translate.instant('createTeam.message'),
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: this.translate.instant('createTeam.namePlaceholder'),
        },
      ],
      buttons: [
        {
          text: this.translate.instant('createTeam.cancel'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('createTeam.create'),
          handler: async (data) => {
            const ahora = new Date();
            this.equipoService.obtenerIDDisponible().subscribe((nextKodea: string) => {
              this.equipo.kodea = nextKodea;
              this.equipo.izena = data.nombre;
              this.equipo.data.eguneratze_data = ahora;
              this.equipo.data.sortze_data = ahora;
  
              this.equipoService.agregarGrupo(this.equipo).subscribe(
                async (response: any) => {
                  const ondoAlerta = await this.alertController.create({
                    header: this.translate.instant('success.header'),
                    message: this.translate.instant('success.message'),
                    buttons: [this.translate.instant('success.ok')],
                  });
  
                  await ondoAlerta.present();
                  ondoAlerta.onDidDismiss().then(() => {
                    window.location.reload();
                  });
                },
                async (error: any) => {
                  console.error('Error al crear el equipo:', error);
                  const errorAlert = await this.alertController.create({
                    header: this.translate.instant('error.header'),
                    message: this.translate.instant('error.message'),
                    buttons: [this.translate.instant('error.ok')],
                  });
  
                  await errorAlert.present();
                }
              );
            });
          },
        },
      ],
    });
  
    await alert.present();
  }  
}