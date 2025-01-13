import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { MaterialService } from '../services/materiales.service';
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
      console.error('Error al cargar materiales:', error);
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
    this.moverVistaAlPrimerMaterial();
  }
  
  moverVistaAlPrimerMaterial() {
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
  

  verDetalles(material: any) {
    console.log('Producto seleccionado:', material);
    this.materialSeleccionado = { ...material };
    this.MaterialConInformacionSeleccionada = true;
  }

  cerrarModal() {
    this.MaterialConInformacionSeleccionada = false;
  }

  editarProducto(material: any) {
    this.MaterialSeleccionadoAnterior = { ...this.materialSeleccionado }; 
    this.editandoMaterial = true;
    this.materialSeleccionado = { ...material };

    this.moverVistaAlPrimerMaterial();
  }

  async confirmarEdicion() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se actualizarán los valores del material.',
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
              const index = this.materiales.findIndex(material => material.id === this.materialSeleccionado.id);
              if (index !== -1) {
                this.materiales[index] = { ...this.materialSeleccionado };
                this.aplicarFiltro({ target: { value: '' } });
              }
              this.editandoMaterial = false;
            } catch (error) {
              console.error('Error al actualizar material:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  cancelarEdicion() {

    this.materialSeleccionado = { ...this.MaterialSeleccionadoAnterior };
    this.editandoMaterial = false;
  
    if (this.content && this.materialSeleccionado.id) {
      const materialIndex = this.materiales.findIndex(p => p.id === this.materialSeleccionado.id);
      if (materialIndex !== -1) {
        const materialElemento = document.getElementById(`ficha-${this.materialSeleccionado.id}`);
        if (materialElemento) {

          const isMobile = window.innerWidth <= 768;
  
          if (isMobile) {
            materialElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
              window.requestAnimationFrame(() => {
                window.scrollBy(0, 300); 
              });
            }, 300); 
          } else {
            materialElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      this.materialesFiltrados = this.materiales.filter((material) => {
        const coincideIzena = material.izena && material.izena.toLowerCase().includes(texto);
        const coincideMarka = material.marka && material.marka.toLowerCase().includes(texto);
        const coincideId = material.id && material.id.toString().includes(texto);
        const coincideEtiqueta = material.etiketa && material.etiketa.toString().includes(texto);
        const coincideFecha = material.fecha && this.compararFechas(material.fecha, texto);
  
        return coincideIzena || coincideMarka || coincideId || coincideEtiqueta || coincideFecha;
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
