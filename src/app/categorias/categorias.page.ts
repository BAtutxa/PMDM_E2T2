import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { IKategoria } from '../interfaces/IKategoria';
import { IData } from '../interfaces/IData';
import { KategoriaService } from '../services/Kategoria.Service';
import { EsHistorialService } from '../services/EsHistorial.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['../productos/productos.page.scss'],
})
export class CategoriasPage implements OnInit {

@ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  editandoFicha: boolean = false;
  clienteConInformacionSeleccionada: boolean = false;
  categoriaSeleccionada: IKategoria | any = {};
  categoriaSeleccionadaAnterior: IKategoria | null = null;
  categorias: IKategoria[] = [];
  categoriasFiltradas: IKategoria[] = [];
  mobilaDa: boolean = false;
  ordenActual: { columna: keyof IKategoria; ascendente: boolean } = { columna: 'id', ascendente: true };
  ordenActualFecha: { columna: keyof IData; ascendente: boolean } = { columna: 'ezabatze_data', ascendente: true };
  categoriasPorPagina = 10;
  paginaActual = 1;
  paginacionMaxima = 0;
  Math: any;
  esHistorial:Boolean = false;
  acabaDeBorrar: boolean = false;

  constructor(
    private alertController: AlertController, 
    private kategoriaService: KategoriaService, 
    private historialService : EsHistorialService,
  ) {}
  

  ngOnInit() {
    this.esHistorial = this.historialService.getEsHistorial();
    console.log(this.esHistorial);
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
  

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilbista();
  }

  mobilbista() {
    this.mobilaDa = window.innerWidth <= 768;
  }

  async cargarClientes() {
    try {
      if (this.esHistorial) {
        this.kategoriaService.getCategoriasDelete().subscribe(categorias => {
          this.categorias = categorias;
          this.categoriasFiltradas = [...this.categorias];
        });
      } else {
        this.kategoriaService.fichas$.subscribe(fichas => {
          this.categorias = fichas;
          this.categoriasFiltradas = [...this.categorias];
        });
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  }
  

  cambiarPagina(pagina: number) {
    if (pagina < 1) {
      this.paginaActual = 1;
    } else if (pagina > Math.ceil(this.categoriasFiltradas.length / this.categoriasPorPagina)) {
      this.paginaActual = Math.ceil(this.categoriasFiltradas.length / this.categoriasPorPagina);
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
    this.paginacionMaxima = Math.ceil(this.categoriasFiltradas.length / this.categoriasPorPagina);
    return Array.from({ length: this.paginacionMaxima }, (_, i) => i + 1);
  }

  async eliminarCategoria() {
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
            this.categoriaSeleccionada.data = this.categoriaSeleccionada.data || {};
            this.categoriaSeleccionada.data.ezabatze_data = now;

            try {
              await firstValueFrom(this.kategoriaService.actualizarCategoria(this.categoriaSeleccionada));
              const index = this.categorias.findIndex(ficha => ficha.id === this.categoriaSeleccionada.id);
              if (index !== -1) {
                this.categorias[index] = { ...this.categoriaSeleccionada };
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

  async trueEliminarCategoria() {
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
              await firstValueFrom(this.kategoriaService.actualizarCategoria(this.categoriaSeleccionada));
  
              this.categorias = this.categorias.filter(ficha => ficha.id !== this.categoriaSeleccionada.id);
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

  async restaurarCategoria() {
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
            this.categoriaSeleccionada.data = this.categoriaSeleccionada.data || {};
            this.categoriaSeleccionada.data.ezabatze_data = null; 
            this.categoriaSeleccionada.data.eguneratze_data = now; 
  
            try {
              const categoriaRestaurada = await firstValueFrom(this.kategoriaService.actualizarCategoria(this.categoriaSeleccionada));
              
              const index = this.categorias.findIndex(categoria => categoria.id === categoriaRestaurada.id);
              if (index !== -1) {
                this.categorias[index] = categoriaRestaurada;
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
  

  editarProducto(categoria: IKategoria) {
    this.categoriaSeleccionadaAnterior = { ...this.categoriaSeleccionada };
    this.editandoFicha = true;
    this.categoriaSeleccionada = { ...categoria };
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
            this.categoriaSeleccionada.data = this.categoriaSeleccionada.data || {};
            this.categoriaSeleccionada.data.eguneratze_data = now;

            try {
              await firstValueFrom(this.kategoriaService.actualizarCategoria(this.categoriaSeleccionada));
              const index = this.categorias.findIndex(ficha => ficha.id === this.categoriaSeleccionada.id);
              if (index !== -1) {
                this.categorias[index] = { ...this.categoriaSeleccionada };
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
    this.categoriaSeleccionada = { ...this.categoriaSeleccionadaAnterior };
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
      this.categoriasFiltradas = [...this.categorias];
    } else {
      this.categoriasFiltradas = this.categorias.filter((ficha: IKategoria) => {
        const coincideIzena = ficha.izena?.toLowerCase().includes(texto) || false;
        const coincideId = ficha.id?.toString().includes(texto) || false;
        const coincideFecha = ficha.data && this.compararFechas(ficha.data, texto);

        return coincideIzena ||  coincideId || coincideFecha;
      });
    }
  }

  ordenarPor(columna: string) {
    if (this.ordenActual.columna !== columna) {
      this.ordenActual.columna = columna as keyof IKategoria;
    }
  
    this.categoriasFiltradas.sort((a, b) => {
      let valorA = this.obtenerValorPorColumna(a, columna);
      let valorB = this.obtenerValorPorColumna(b, columna);
  
      // Convertir valores a fecha si la columna es de tipo fecha
      if (columna === 'sortze_data' || columna === 'eguneratze_data' || columna === 'data') {
        valorA = valorA ? new Date(valorA) : null;
        valorB = valorB ? new Date(valorB) : null;
      }
  
      if (valorA === null) return this.ordenActual.ascendente ? 1 : -1;
      if (valorB === null) return this.ordenActual.ascendente ? -1 : 1;
  
      // Comparar correctamente los valores numéricos o de fecha
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
  
  private obtenerValorPorColumna(objeto: IKategoria, columna: string): any {
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
