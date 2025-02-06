import { Component, HostListener, OnInit, viewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ProductoService } from '../services/productos.service';
import { firstValueFrom } from 'rxjs';
import { IonContent } from '@ionic/angular';
import { IEProduktuak } from '../interfaces/IEProduktuak';
import { TranslateService } from '@ngx-translate/core';
import { KategoriaService } from '../services/Kategoria.Service';
import { IKategoria } from '../interfaces/IKategoria';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  readonly content = viewChild(IonContent);

  editandoProducto: boolean = false;
  productoConInformacionSeleccionada: boolean = false;
  productoSeleccionado: IEProduktuak | any = {};
  productoSeleccionadoAnterior: IEProduktuak | null = null;
  productos: IEProduktuak[] = [];
  productosFiltrados: IEProduktuak[] = [];
  mobilaDa: Boolean = false;
  ordenActual: { columna: string, ascendente: boolean } = { columna: 'id', ascendente: true };
  ordenAnterior: { columna: string, ascendente: boolean } = { columna: 'id', ascendente: true };
  productosPorPagina = 10;
  paginaActual = 1;
  paginacionMaxima = 0;
  Math: any;
  categorias: IKategoria [] = [];

  //tradukzioa
  title: string = ''
  name: string = ''
  brand: string = ''
  id_category: string = ''
  name_category : string = ''
  cd: string = ''
  ud: string = ''
  edit: string = ''
  confirm: string = ''
  cancel: string = ''
  info: string = ''
  search: string = ''
  esHistorial: Boolean = false;
  esProfe: Boolean = false;

  constructor(
    private alertController: AlertController, 
    private productoService: ProductoService, 
    private translateService: TranslateService, 
    private kategoriakService: KategoriaService,
    private userService:UserService
  ) {}

  ngOnInit() {
    this.VerSiEsProfe();
    this.mobilbista();
    this.cargarProductos();
    this.cargarCategorias();
    this.translateLabels();

    this.translateService.setDefaultLang('es');
    this.translateService.use('es');
  }

  VerSiEsProfe(){
    const rola = this.userService.getRola().rola;
   
    if(rola === 'IR'){
      this.esProfe = true;
    }else{
      this.esProfe = false;
    }
  }

  cargarCategorias() {
    this.kategoriakService.getCategorias().subscribe(
      (categorias) => {
        this.categorias = categorias;  // Asignamos las categorías obtenidas al array 'categorias'
      },
      (error) => {
        console.error('Error al cargar las categorías', error);  // Manejo de errores
      }
    );
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilbista();
  }

  par(index: number): boolean {
    return index % 2 === 0; // Devuelve true para columnas pares, false para columnas impares
  }
  

  mobilbista() {
    this.mobilaDa = window.innerWidth <= 1200;
  }

  async cargarProductos() {
    try {
      const data = await firstValueFrom(this.productoService.getProductos());
      this.productos = data;
      this.productosFiltrados = [...this.productos];
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1) {
      this.paginaActual = 1;
    } else if (pagina > Math.ceil(this.productosFiltrados.length / this.productosPorPagina)) {
      this.paginaActual = Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
    } else {
      this.paginaActual = pagina;
    }
    this.moverVistaAlPrimerProducto();
  }

  moverVistaAlPrimerProducto() {
    
    const content = this.content();
    if (content) {
      content.scrollToTop(500);
    }
  }

  hacerPaginacion() {
    this.paginacionMaxima = Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
    let paginacion = [];
    for (let i = 1; i <= this.paginacionMaxima; i++) {
      paginacion.push(i);
    }
    return paginacion;
  }

  verDetalles(producto: IEProduktuak) {
    this.productoSeleccionado = { ...producto };
    this.productoConInformacionSeleccionada = true;
  }

  cerrarModal() {
    this.productoConInformacionSeleccionada = false;
  }

  editarProducto(producto: IEProduktuak) {
    this.productoSeleccionadoAnterior = { ...this.productoSeleccionado };
    this.editandoProducto = true;
    this.productoSeleccionado = { ...producto };
    this.moverVistaAlPrimerProducto();
  }

  async confirmarEdicion() {
    const translations = await this.translateService.get(['Aldaketak egin nahi dira', 'Aldaketak konfirmatu nahi dituzu?', 'UTZI', 'KONFIRMATU']).toPromise();
  
    const alert = await this.alertController.create({
      header: translations['Aldaketak egin nahi dira'],
      message: translations['Aldaketak konfirmatu nahi dituzu?'],
      buttons: [
        {
          text: translations['UTZI'],
          role: 'cancel',
          handler: () => {
            // Cerrar el modal o el card inmediatamente al hacer click en "cancelar"
            this.productoConInformacionSeleccionada = false;
          }
        },
        {
          text: translations['KONFIRMATU'],
          handler: async () => {
            const now = new Date().toISOString();
            this.productoSeleccionado.data = this.productoSeleccionado.data || {};
            this.productoSeleccionado.data.eguneratze_data = now;
  
            try {
              // Actualizamos el producto
              await firstValueFrom(this.productoService.actualizarProducto(this.productoSeleccionado));
  
              // Actualizamos el producto en la lista
              const index = this.productos.findIndex(producto => producto.id === this.productoSeleccionado.id);
              if (index !== -1) {
                this.productos[index] = { ...this.productoSeleccionado };
                this.aplicarFiltro({ target: { value: '' } });
              }
  
              // Cierra el modal o el card
              this.productoConInformacionSeleccionada = false; // Asegúrate de cerrar el modal
  
              // Opcionalmente recarga la página (si necesario)
              window.location.reload();
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
    this.productoSeleccionado = { ...this.productoSeleccionadoAnterior };
    this.editandoProducto = false;

    if (this.content() && this.productoSeleccionado.id) {
      const productoIndex = this.productos.findIndex(p => p.id === this.productoSeleccionado.id);
      if (productoIndex !== -1) {
        const productoElemento = document.getElementById(`producto-${this.productoSeleccionado.id}`);
        if (productoElemento) {
          const isMobile = window.innerWidth <= 768;
          if (isMobile) {
            productoElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              window.requestAnimationFrame(() => {
                window.scrollBy(0, 300);
              });
            }, 300);
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
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter((producto) => {
        const coincideIzena = producto.izena && producto.izena.toLowerCase().includes(texto);
        const coincideMarka = producto.marka && producto.marka.toLowerCase().includes(texto);
        const coincideId = producto.id && producto.id.toString().includes(texto);
        const coincideIdKategoria = producto.kategoriak.id && producto.kategoriak.id.toString().includes(texto);
        const coincideFecha = producto.data && this.compararFechas(producto.data, texto);
        return coincideIzena || coincideMarka || coincideId || coincideIdKategoria || coincideFecha;
      });
    }
  }

  compararFechas(fecha: any, texto: string): boolean {
    if (fecha instanceof Date && !isNaN(fecha.getTime())) {
      const fechaNormalizada = fecha.toISOString().toLowerCase();
      return fechaNormalizada.includes(texto.toLowerCase());
    } else {
      return false;
    }
  }

ordenarPor(columna: string) {
  // Si la columna seleccionada es diferente, actualizamos la columna
  if (this.ordenActual.columna !== columna) {
    this.ordenActual.columna = columna;
    this.ordenActual.ascendente = true;  // Reseteamos a ascendente cuando cambiamos de columna
  }

  this.productosFiltrados.sort((a, b) => {
    let valorA = this.obtenerValorPorColumna(a, columna);
    let valorB = this.obtenerValorPorColumna(b, columna);

    if (columna === 'sortze_data' || columna === 'eguneratze_data' || columna === 'data') {
      valorA = valorA ? new Date(valorA) : null;
      valorB = valorB ? new Date(valorB) : null;
    }

    // Si uno de los valores es null, lo ponemos en el orden correspondiente según 'ascendente'
    if (valorA === null) return this.ordenActual.ascendente ? 1 : -1;
    if (valorB === null) return this.ordenActual.ascendente ? -1 : 1;

    // Comparamos los valores y aplicamos la lógica ascendente o descendente
    return this.ordenActual.ascendente
      ? (valorA > valorB ? 1 : valorA < valorB ? -1 : 0)
      : (valorA > valorB ? -1 : valorA < valorB ? 1 : 0);
  });
}

cambiarOrden(event: any) {
  // Asignamos el valor de ascendente basándonos en la selección
  this.ordenActual.ascendente = event.detail.value === true || event.detail.value === "true";

  // Si ya hay una columna seleccionada, ordenamos de nuevo
  if (this.ordenActual.columna) {
    setTimeout(() => {
      this.ordenarPor(this.ordenActual.columna);
    }, 0);
  }
}

private obtenerValorPorColumna(objeto: any, columna: string): any {
  const propiedades = columna.split('.'); // Soporta columnas anidadas como 'kategoriak.id'
  let valor: any = objeto;

  for (const propiedad of propiedades) {
    if (valor && typeof valor === 'object' && propiedad in valor) {
      valor = valor[propiedad]; // Accede a la propiedad
    } else {
      return null; // Retorna null si no existe la propiedad
    }
  }

  return valor;
}

  translateLabels() {
    this.translateService.get([
      'PRODUCT.TITLE',
      'PRODUCT.NAME',
      'PRODUCT.BRAND',
      'PRODUCT.ID_CATEGORY',
      'PRODUCT.CATEGORY_NAME',
      'PRODUCT.ID_NAME',
      'PRODUCT.CD',
      'PRODUCT.UD',
      'PRODUCT.EDIT',
      'PRODUCT.CONFIRM',
      'PRODUCT.CANCEL',
      'PRODUCT.INFO',
      'PRODUCT.SEARCH'
    ]).subscribe((translations: { [key: string]: any; }) => {
      this.title = translations['PRODUCT.TITLE'];
      this.name = translations['PRODUCT.NAME'];
      this.brand = translations['PRODUCT.BRAND'];
      this.id_category = translations['PRODUCT.ID_CATEGORY'];
      this.name_category = translations ['PRODUCT.CATEGORY_NAME']
      this.cd = translations['PRODUCT.CD'];
      this.ud = translations['PRODUCT.UD'];
      this.edit = translations['PRODUCT.EDIT'];
      this.confirm = translations['PRODUCT.CONFIRM'];
      this.cancel = translations['PRODUCT.CANCEL'];
      this.info = translations['PRODUCT.INFO'];
      this.search = translations['PRODUCT.SEARCH']
    });
  }

  changeLanguage(lang: string) {
    this.translateService.use(lang);
    this.translateLabels();
  }
}
