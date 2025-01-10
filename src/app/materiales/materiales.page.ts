import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { MaterialService } from '../services/Materiales.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.page.html',
  styleUrls: ['../productos/productos.page.scss'],
})
export class MaterialesPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  editandoMaterial: boolean = false;
  MaterialConInformacionSeleccionada: boolean = false;
  materialSeleccionado: any = {};
  MaterialSeleccionadoAnterior: any = null; 
  materiales: any[] = [];
  materialesFiltrados: any[] = [];
  mobilaDa: Boolean = false;
  ordenActual: { columna: string, ascendente: boolean } = { columna: '', ascendente: true };
  materialesPorPagina = 10;
  paginaActual = 1;
  paginacionMaxima = 0;
  Math: any;

  constructor(private alertController: AlertController, private MaterialService: MaterialService) {}

  ngOnInit() {
    this.mobilbista();
    this.cargarProductos();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilbista();
  }

  mobilbista() {
    this.mobilaDa = window.innerWidth <= 768;
  }

  async cargarProductos() {
    try {
      const data = await firstValueFrom(this.MaterialService.getMateriales());
      this.materiales = data;
      this.materialesFiltrados = [...this.materiales];
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1) {
      this.paginaActual = 1;
    } else if (pagina > Math.ceil(this.materialesFiltrados.length / this.materialesPorPagina)) {
      this.paginaActual = Math.ceil(this.materialesFiltrados.length / this.materialesPorPagina);
    } else {
      this.paginaActual = pagina;
    }
    this.moverVistaAlPrimerProducto();
  }
  
  moverVistaAlPrimerProducto() {
    if (this.content) {
      this.content.scrollToTop(500); 
    }
  }

  hacerPaginacion() {
    this.paginacionMaxima = Math.ceil(this.materialesFiltrados.length / this.materialesPorPagina);
    let paginacion = [];
    for (let i = 1; i <= this.paginacionMaxima; i++) {
      paginacion.push(i);
    }
    return paginacion;
  }
  

  verDetalles(producto: any) {
    console.log('Producto seleccionado:', producto);
    this.materialSeleccionado = { ...producto };
    this.MaterialConInformacionSeleccionada = true;
  }

  cerrarModal() {
    this.MaterialConInformacionSeleccionada = false;
  }

  editarProducto(producto: any) {
    this.MaterialSeleccionadoAnterior = { ...this.materialSeleccionado }; // Guardar el producto seleccionado previamente
    this.editandoMaterial = true;
    this.materialSeleccionado = { ...producto };

    // Mover la vista al primer producto
    this.moverVistaAlPrimerProducto();
  }

  async confirmarEdicion() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se actualizarán los valores del producto.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const now = new Date().toISOString();
            this.materialSeleccionado.data = this.materialSeleccionado.data || {};
            this.materialSeleccionado.data.eguneratze_data = now;

            try {
              await firstValueFrom(this.MaterialService.actualizarMaterial(this.materialSeleccionado));
              const index = this.materiales.findIndex(producto => producto.id === this.materialSeleccionado.id);
              if (index !== -1) {
                this.materiales[index] = { ...this.materialSeleccionado };
                this.aplicarFiltro({ target: { value: '' } });
              }
              this.editandoMaterial = false;
            } catch (error) {
              console.error('Error al actualizar producto:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  cancelarEdicion() {
    // Restaurar el producto seleccionado previamente
    this.materialSeleccionado = { ...this.MaterialSeleccionadoAnterior };
    this.editandoMaterial = false;
  
    // Si no estamos en vista móvil, volvemos a mostrar el producto seleccionado
    if (this.content && this.materialSeleccionado.id) {
      const productoIndex = this.materiales.findIndex(p => p.id === this.materialSeleccionado.id);
      if (productoIndex !== -1) {
        // Mover la vista al producto seleccionado previamente
        const productoElemento = document.getElementById(`producto-${this.materialSeleccionado.id}`);
        if (productoElemento) {
          // Detectar si estamos en un dispositivo móvil
          const isMobile = window.innerWidth <= 768; // Ajusta el valor según tu necesidad
  
          // Si estamos en vista móvil, hacer un desplazamiento personalizado
          if (isMobile) {
            productoElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
            // Usar requestAnimationFrame para un desplazamiento suave después de scrollIntoView
            setTimeout(() => {
              window.requestAnimationFrame(() => {
                window.scrollBy(0, 300); // Desplazamiento hacia abajo
              });
            }, 300); // Ajustar el retraso según sea necesario
          } else {
            productoElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }
  }
  
  
  aplicarFiltro(event: any) {
    const texto = event.target.value.toLowerCase();
    
    if (texto.trim() === '') {
      this.materialesFiltrados = [...this.materiales];
    } else {
      this.materialesFiltrados = this.materiales.filter((producto) => {
        const coincideIzena = producto.izena && producto.izena.toLowerCase().includes(texto);
        const coincideMarka = producto.marka && producto.marka.toLowerCase().includes(texto);
        const coincideId = producto.id && producto.id.toString().includes(texto);
        const coincideIdKategoria = producto.id_kategoria && producto.id_kategoria.toString().includes(texto);
        const coincideFecha = producto.fecha && this.compararFechas(producto.fecha, texto);
  
        return coincideIzena || coincideMarka || coincideId || coincideIdKategoria || coincideFecha;
      });
    }
  }
  
  compararFechas(fecha: string, texto: string): boolean {
    const fechaNormalizada = fecha.toLowerCase();
    return fechaNormalizada.includes(texto);
  }

  ordenarPor(columna: string) {
    if (this.ordenActual.columna === columna) {
      this.ordenActual.ascendente = !this.ordenActual.ascendente;
    } else {
      this.ordenActual.columna = columna;
      this.ordenActual.ascendente = true;
    }

    this.materialesFiltrados.sort((a, b) => {
      let valorA = a[columna];
      let valorB = b[columna];

      if (columna === 'sortze_data' || columna === 'eguneratze_data') {
        valorA = valorA ? new Date(valorA) : null;
        valorB = valorB ? new Date(valorB) : null;
      }

      if (valorA < valorB || valorA === null) {
        return this.ordenActual.ascendente ? -1 : 1;
      } else if (valorA > valorB || valorB === null) {
        return this.ordenActual.ascendente ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  getOrdenClass(columna: string): string {
    if (this.ordenActual.columna === columna) {
      return this.ordenActual.ascendente ? 'orden-asc' : 'orden-desc';
    }
    return '';
  }
} 
