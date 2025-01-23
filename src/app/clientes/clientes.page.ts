import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { ClientesService } from '../services/clientes.service';
import { HostListener } from '@angular/core';
import { IBezero } from '../interfaces/IEBezero';
import { IData } from '../interfaces/IData';

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
  Math: any;

  constructor(
    private alertController: AlertController, 
    private ClientesService: ClientesService, 
  ) {}
  

  ngOnInit() {
    this.mobilbista();
    this.cargarClientes();
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
      const data: IBezero[] = await firstValueFrom(this.ClientesService.getFichas());
      this.fichas = data;
      this.fichasFiltradas = [...this.fichas];
    } catch (error) {
      console.error('Error al cargar clientes:', error);
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
              await firstValueFrom(this.ClientesService.eliminarFicha(this.fichaSeleccionada));
              const index = this.fichas.findIndex(ficha => ficha.id === this.fichaSeleccionada.id);
              if (index !== -1) {
                this.fichas[index] = { ...this.fichaSeleccionada };
                this.aplicarFiltro({ target: { value: '' } });
              }
              this.editandoFicha = false;
              window.location.reload();
            } catch (error) {
              console.error('Error al borrar ficha:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  cerrarModal() {
    this.clienteConInformacionSeleccionada = false;
  }

  editarProducto(ficha: IBezero) {
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
              window.location.reload();
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

  compararFechas(data: IData, texto: string): boolean {
    const fechaNormalizada = new Date(data.sortze_data || '').toISOString().toLowerCase();
    return fechaNormalizada.includes(texto.toLowerCase());
  }

  ordenarPor(columna: keyof IBezero) {
    if (this.ordenActual.columna === columna) {
      this.ordenActual.ascendente = !this.ordenActual.ascendente;
    } else {
      this.ordenActual.columna = columna;
      this.ordenActual.ascendente = true;
    }
  
    this.fichasFiltradas.sort((a, b) => {
      const valorA = this.obtenerValorPorColumna(a, columna);
      const valorB = this.obtenerValorPorColumna(b, columna);
  
      // Handle null or undefined values by placing them at the end or beginning
      if (valorA === null || valorA === undefined) return this.ordenActual.ascendente ? 1 : -1;
      if (valorB === null || valorB === undefined) return this.ordenActual.ascendente ? -1 : 1;
  
      // Compare strings using localeCompare for case-insensitive comparison
      if (typeof valorA === 'string' && typeof valorB === 'string') {
        return this.ordenActual.ascendente
          ? valorA.localeCompare(valorB)
          : valorB.localeCompare(valorA);
      }
  
      // Compare numbers or other data types
      if (valorA < valorB) return this.ordenActual.ascendente ? -1 : 1;
      if (valorA > valorB) return this.ordenActual.ascendente ? 1 : -1;
  
      return 0; // If values are equal
    });
  }
  

  obtenerValorPorColumna(item: IBezero, columna: keyof IBezero) {
    return item[columna];
  }

  ordenarPorFecha(columna: keyof IData) {
    this.ordenActualFecha.ascendente = this.ordenActualFecha.columna === columna ? !this.ordenActualFecha.ascendente : true;
    this.ordenActualFecha.columna = columna;

    this.fichasFiltradas.sort((a, b) => {
      const valorA = a.data?.[columna] ? new Date(a.data[columna]!) : null;
      const valorB = b.data?.[columna] ? new Date(b.data[columna]!) : null;

      if (valorA && valorB) {
        return this.ordenActualFecha.ascendente ? valorA.getTime() - valorB.getTime() : valorB.getTime() - valorA.getTime();
      }
      return valorA ? -1 : 1;
    });
  }

  getOrdenClass(columna: string): string {
    return this.ordenActual.columna === columna
      ? this.ordenActual.ascendente
        ? 'orden-asc'
        : 'orden-desc'
      : '';
  }
}
