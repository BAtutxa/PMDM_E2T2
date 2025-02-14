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
import { EsHistorialService } from '../services/EsHistorial.service';

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

  esHistorial: boolean = false;
  acabaDeBorrar: boolean = false;
  loading: any;

  constructor(
    private router: Router, 
    private menuCtrl: MenuController,
    private equipoService: EquipoService,
    private alertController: AlertController,
    private langileakService: LangileakService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private historialService: EsHistorialService,
    private route: ActivatedRoute,
  ) {}

  ngOnDestroy() {
    if (this.acabaDeBorrar) {
      console.log('Eliminado, no se restablece esHistorial.');
    } else {
      this.historialService.resetEsHistorial();
      console.log('Se ha restablecido esHistorial a false');
    }
  }

  goToTxandak(event: Event) {
    event.stopPropagation(); 
    this.router.navigate(['/txandak']);
    this.menuCtrl.open(); 
  }

  goToOrdutegi(event: Event) {
    event.stopPropagation(); 
    this.router.navigate(['/ordutegi']); 
    this.menuCtrl.open();
  }

  ngOnInit(): void {
    this.grupoId = this.activatedRoute.snapshot.paramMap.get('kodea')!;
    this.route.queryParams.subscribe(params => {
      this.esHistorial = params['desdeHistorial'] === 'true';
      this.historialService.setEsHistorial(this.esHistorial);
      console.log("Historial:", this.esHistorial);
    });
    console.log("Es historial", this.esHistorial);
    if(this.esHistorial){
      this.cargarGruposEliminados();
    }else{
      this.cargarGrupos();
    }
 
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

  cargarGruposEliminados(): void {
    this.equipoService.cargarGruposEliminados().subscribe({
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
            grupo.langileak = [];

            try {
              await firstValueFrom(this.equipoService.actualizarGrupo(grupo));
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

  async restaurar(grupo: IEquipos): Promise<void> {
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
            grupo.data.ezabatze_data = null;

            try {
              await firstValueFrom(this.equipoService.actualizarGrupo(grupo));
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

  async eliminarGrupoDefinitivo(grupo: IEquipos): Promise<void> {
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
  
            // Vaciar el array de langileak
            grupo.langileak = [];
  
            try {
              // Actualizar el grupo para vaciar langileak
              await firstValueFrom(this.equipoService.actualizarGrupo(grupo));
  
              // Eliminar físicamente el grupo
              await firstValueFrom(this.equipoService.eliminarGrupo(grupo));
  
              // Actualizar la lista de equipos en el frontend
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