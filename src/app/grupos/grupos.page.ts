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
    private activatedRoute: ActivatedRoute
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
    alert('Cambios guardados con éxito');
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
      header: '¿Estás seguro?',
      message: 'Se eliminará el grupo seleccionado.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
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
      header: 'Crear Nuevo Equipo',
      message: 'Ingresa los detalles del nuevo equipo.',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del equipo',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Crear',
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
                    header: 'Éxito',
                    message: 'Nuevo equipo creado con éxito.',
                    buttons: ['OK'],
                  });
  
                  await ondoAlerta.present();
                  ondoAlerta.onDidDismiss().then(() => {
                    window.location.reload();
                  });
                },
                async (error: any) => {
                  console.error('Error al crear el equipo:', error);
                  const errorAlert = await this.alertController.create({
                    header: 'Error',
                    message: 'Hubo un error al crear el equipo.',
                    buttons: ['OK'],
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
