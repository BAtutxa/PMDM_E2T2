import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ClientesService } from '../services/clientes.service';
import { IBezero } from '../interfaces/IEBezero';
import { IData } from '../interfaces/IData';
import { EsHistorialService } from '../services/EsHistorial.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['../productos/productos.page.scss'],
})
export class ClientesPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  editandoFicha: boolean = false;
  clienteConInformacionSeleccionada: boolean = false;
  fichaSeleccionada: IBezero | any = {};
  fichaSeleccionadaAnterior: IBezero | null = null;
  fichas: IBezero[] = [];
  fichasFiltradas: IBezero[] = [];
  mobilaDa: boolean = false;
  ordenActual: { columna: keyof IBezero; ascendente: boolean } = { columna: 'id', ascendente: true };
  ordenActualFecha: { columna: keyof IData; ascendente: boolean } = { columna: 'ezabatze_data', ascendente: true };
  FichasPorPagina = 10;
  paginaActual = 1;
  paginacionMaxima = 0;
  esHistorial: boolean = false;
  acabaDeBorrar: boolean = false;
  loading: any;

  constructor(
    private alertController: AlertController, 
    private ClientesService: ClientesService, 
    private historialService: EsHistorialService,
    private loadingController: LoadingController,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Leer el parámetro "desdeHistorial" de la URL
    this.route.queryParams.subscribe(params => {
      this.esHistorial = params['desdeHistorial'] === 'true';
      this.historialService.setEsHistorial(this.esHistorial);
      console.log("Historial:", this.esHistorial);
    });
    this.mobilbista();
    this.cargarClientes();
  }

  ngOnDestroy() {
    if (this.acabaDeBorrar) {
      console.log('Ficha eliminada, no se restablece esHistorial.');
    } else {
      this.historialService.resetEsHistorial();
      console.log('Se ha restablecido esHistorial a false');
    }
  }

  par(index: number): boolean {
    return index % 2 === 0;
  }
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilbista();
  }

  mobilbista() {
    this.mobilaDa = window.innerWidth <= 768;
  }

  async cargarClientes() {
    try {
      // Muestra el loading mientras se cargan los clientes
      this.loading = await this.loadingController.create({
        message: 'Cargando clientes...',
        spinner: 'crescent',
      });
      await this.loading.present();
  
      if (this.esHistorial) {
        this.ClientesService.getFichasDelete().subscribe(fichas => {
          this.fichas = fichas;
          this.fichasFiltradas = [...this.fichas];
          this.loading.dismiss(); // Cierra el loading cuando los datos se carguen
        });
      } else {
        this.ClientesService.fichas$.subscribe(fichas => {
          this.fichas = fichas;
          this.fichasFiltradas = [...this.fichas];
          this.loading.dismiss(); // Cierra el loading cuando los datos se carguen
        });
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      this.loading.dismiss(); // Asegúrate de cerrar el loading si ocurre un error
    }
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1) {
      this.paginaActual = 1;
    } else if (pagina > Math.ceil(this.fichasFiltradas.length / this.FichasPorPagina)) {
      this.paginaActual = Math.ceil(this.fichasFiltradas.length / this.FichasPorPagina);
    } else {
      this.paginaActual = pagina;
    }
    this.moverVistaAlaPrimeraFicha();
  }

  moverVistaAlaPrimeraFicha() {
    if (this.content) {
      this.content.scrollToTop(500);
    }
  }

  hacerPaginacion() {
    this.paginacionMaxima = Math.ceil(this.fichasFiltradas.length / this.FichasPorPagina);
    return Array.from({ length: this.paginacionMaxima }, (_, i) => i + 1);
  }

  async eliminarFicha() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se borrará la ficha.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const now = new Date();
            this.fichaSeleccionada.data = this.fichaSeleccionada.data || {};
            this.fichaSeleccionada.data.ezabatze_data = now;

            try {
              await firstValueFrom(this.ClientesService.actualizarFicha(this.fichaSeleccionada));
              const index = this.fichas.findIndex(ficha => ficha.id === this.fichaSeleccionada.id);
              if (index !== -1) {
                this.fichas[index] = { ...this.fichaSeleccionada };
                this.aplicarFiltro({ target: { value: '' } });
              }
              this.editandoFicha = false;
            } catch (error) {
              console.error('Error al borrar ficha:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async trueEliminarFicha() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se borrará definitivamente la ficha y no se podrá recuperar.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            try {
              await firstValueFrom(this.ClientesService.eliminarFicha(this.fichaSeleccionada));
  
              this.fichas = this.fichas.filter(ficha => ficha.id !== this.fichaSeleccionada.id);
              this.acabaDeBorrar = true; 
              this.editandoFicha = false;
            } catch (error) {
              console.error('Error al borrar ficha:', error);
            }
          },
        },
      ],
    });
  
    await alert.present();
  }

  async restaurarFicha() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se restaurará la ficha.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const now = new Date();
            this.fichaSeleccionada.data = this.fichaSeleccionada.data || {};
            this.fichaSeleccionada.data.ezabatze_data = null; 
            this.fichaSeleccionada.data.eguneratze_data = now; 
  
            try {
              const fichaRestaurada = await firstValueFrom(this.ClientesService.actualizarFicha(this.fichaSeleccionada));
              
              const index = this.fichas.findIndex(ficha => ficha.id === fichaRestaurada.id);
              if (index !== -1) {
                this.fichas[index] = fichaRestaurada;
              }
  
              this.acabaDeBorrar = true;
              this.editandoFicha = false;
            } catch (error) {
              console.error('Error al restaurar ficha:', error);
            }
          },
        },
      ],
    });
  
    await alert.present();
  }

  editarFicha(ficha: IBezero) {
    this.fichaSeleccionadaAnterior = { ...this.fichaSeleccionada };
    this.editandoFicha = true;
    this.fichaSeleccionada = { ...ficha };
    this.moverVistaAlaPrimeraFicha();
  }

  async confirmarEdicion() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se actualizarán los valores de la ficha.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const now = new Date();
            this.fichaSeleccionada.data = this.fichaSeleccionada.data || {};
            this.fichaSeleccionada.data.eguneratze_data = now;

            try {
              await firstValueFrom(this.ClientesService.actualizarFicha(this.fichaSeleccionada));
              const index = this.fichas.findIndex(ficha => ficha.id === this.fichaSeleccionada.id);
              if (index !== -1) {
                this.fichas[index] = { ...this.fichaSeleccionada };
                this.aplicarFiltro({ target: { value: '' } });
              }
              this.editandoFicha = false;
            } catch (error) {
              console.error('Error al actualizar ficha:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  cancelarEdicion() {
    this.fichaSeleccionada = { ...this.fichaSeleccionadaAnterior };
    this.editandoFicha = false;
  }

  private compararFechas(fecha: IData, texto: string): boolean {
    if (!fecha || !fecha.toString()) return false;
  
    const fechaStr = fecha.toString().toLowerCase(); // Convertir la fecha a string
    return fechaStr.includes(texto);
  }

  aplicarFiltro(event: any) {
    const texto = event.target.value.toLowerCase();

    if (texto.trim() === '') {
      this.fichasFiltradas = [...this.fichas];
    } else {
      this.fichasFiltradas = this.fichas.filter((ficha: IBezero) => {
        const coincideIzena = ficha.izena?.toLowerCase().includes(texto) || false;
        const coincideAbizena = ficha.abizena?.toLowerCase().includes(texto) || false;
        const coincideId = ficha.id?.toString().includes(texto) || false;
        const coincideTelefonoa = ficha.telefonoa?.toString().includes(texto) || false;
        const coincideAzala = ficha.azal_sentikorra?.toString().includes(texto) || false;
        const coincideFecha = ficha.data && this.compararFechas(ficha.data, texto);

        return coincideIzena || coincideAbizena || coincideId || coincideTelefonoa || coincideAzala || coincideFecha;
      });
    }
  }

  ordenarPor(columna: string) {
    if (this.ordenActual.columna !== columna) {
      this.ordenActual.columna = columna as keyof IBezero;
    }
  
    this.fichasFiltradas.sort((a, b) => {
      let valorA = this.obtenerValorPorColumna(a, columna);
      let valorB = this.obtenerValorPorColumna(b, columna);
  
      if (columna === 'sortze_data' || columna === 'eguneratze_data' || columna === 'data') {
        valorA = valorA ? new Date(valorA) : null;
        valorB = valorB ? new Date(valorB) : null;
      }
  
      if (valorA === null) return this.ordenActual.ascendente ? 1 : -1;
      if (valorB === null) return this.ordenActual.ascendente ? -1 : 1;
  
      return this.ordenActual.ascendente 
        ? (valorA > valorB ? 1 : valorA < valorB ? -1 : 0) 
        : (valorA > valorB ? -1 : valorA < valorB ? 1 : 0);
    });
  }
  
  cambiarOrden(event: any) {
    this.ordenActual.ascendente = event.detail.value === true || event.detail.value === "true";
  
    if (this.ordenActual.columna) {
      setTimeout(() => { 
        this.ordenarPor(this.ordenActual.columna); 
      }, 0);
    }
  }
  
  private obtenerValorPorColumna(objeto: IBezero, columna: string): any {
    const propiedades = columna.split('.');
    let valor: any = objeto;
  
    for (const propiedad of propiedades) {
      if (valor && typeof valor === 'object' && propiedad in valor) {
        valor = valor[propiedad as keyof typeof valor];
      } else {
        return null;
      }
    }
  
    return valor;
  }
}
