import { ProductosPage } from './../productos/productos.page';
import { Component, HostListener, OnInit, viewChild } from '@angular/core';
import { IZerbitzuak } from './../interfaces/IZerbitzuak';
import { ZerbitzuakService } from '../services/zerbitzuak.service';
import { AlertController, IonContent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../services/user.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['../Productos/Productos.page.scss'],
})
export class ServiciosPage implements OnInit {
 readonly content = viewChild(IonContent);
 
   editandoServicio: boolean = false;
   servicioConInformacionSeleccionada: boolean = false;
   servicioSeleccionado: IZerbitzuak | any = {};
   servicioSeleccionadoAnterior: IZerbitzuak | null = null;
   servicios: IZerbitzuak[] = [];
   serviciosFiltrados: IZerbitzuak[] = [];
   mobilaDa: Boolean = false;
   ordenActual: { columna: string, ascendente: boolean } = { columna: 'id', ascendente: true };
   ordenAnterior: { columna: string, ascendente: boolean } = { columna: 'id', ascendente: true };
   ServiciosPorPagina = 10;
   paginaActual = 1;
   paginacionMaxima = 0;
   Math: any;
 
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
     private servicioService: ZerbitzuakService, 
     private translateService: TranslateService, 
     private userService:UserService
   ) {}
 
   ngOnInit() {
     this.VerSiEsProfe();
     this.mobilbista();
     this.cargarServicios();
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
 
   async cargarServicios() {
     try {
       const data = await firstValueFrom(this.servicioService.getZerbitzuak());
       this.servicios = data;
       this.serviciosFiltrados = [...this.servicios];
     } catch (error) {
       console.error('Error al cargar productos:', error);
     }
   }
 
   cambiarPagina(pagina: number) {
     if (pagina < 1) {
       this.paginaActual = 1;
     } else if (pagina > Math.ceil(this.serviciosFiltrados.length / this.ServiciosPorPagina)) {
       this.paginaActual = Math.ceil(this.serviciosFiltrados.length / this.ServiciosPorPagina);
     } else {
       this.paginaActual = pagina;
     }
     this.moverVistaAlPrimerServicio();
   }
 
   moverVistaAlPrimerServicio() {
     
     const content = this.content();
     if (content) {
       content.scrollToTop(500);
     }
   }
 
   hacerPaginacion() {
     this.paginacionMaxima = Math.ceil(this.serviciosFiltrados.length / this.ServiciosPorPagina);
     let paginacion = [];
     for (let i = 1; i <= this.paginacionMaxima; i++) {
       paginacion.push(i);
     }
     return paginacion;
   }
 
 
   editarProducto(servicio: IZerbitzuak) {
     this.servicioSeleccionadoAnterior = { ...this.servicioSeleccionado };
     this.editandoServicio = true;
     this.servicioSeleccionado = { ...servicio };
     this.moverVistaAlPrimerServicio();
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
             this.servicioConInformacionSeleccionada = false;
           }
         },
         {
           text: translations['KONFIRMATU'],
           handler: async () => {
             const now = new Date().toISOString();
             this.servicioSeleccionado.data = this.servicioSeleccionado.data || {};
             this.servicioSeleccionado.data.eguneratze_data = now;
   
             try {
               // Actualizamos el producto
               await firstValueFrom(this.servicioService.updateZerbitzuak(this.servicioSeleccionado));
   
               // Actualizamos el producto en la lista
               const index = this.servicios.findIndex(producto => producto.id === this.servicioSeleccionado.id);
               if (index !== -1) {
                 this.servicios[index] = { ...this.servicioSeleccionado };
                 this.aplicarFiltro({ target: { value: '' } });
               }
   
               // Cierra el modal o el card
               this.servicioConInformacionSeleccionada = false; // Asegúrate de cerrar el modal
   
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
     this.servicioSeleccionado = { ...this.servicioSeleccionadoAnterior };
     this.editandoServicio = false;
 
     if (this.content() && this.servicioSeleccionado.id) {
       const productoIndex = this.servicios.findIndex(p => p.id === this.servicioSeleccionado.id);
       if (productoIndex !== -1) {
         const productoElemento = document.getElementById(`producto-${this.servicioSeleccionado.id}`);
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
       this.serviciosFiltrados = [...this.servicios];
     } else {
       this.serviciosFiltrados = this.servicios.filter((servicio) => {
         const coincideIzena = servicio.izena && servicio.izena.toLowerCase().includes(texto);
         const coincideEtxeko = servicio.etxeko_prezioa && servicio.etxeko_prezioa.toString().includes(texto);
         const coincideKanpoko = servicio.kanpoko_prezioa && servicio.kanpoko_prezioa.toString().includes(texto);
         const coincideId = servicio.id && servicio.id.toString().includes(texto);
         const coincideFecha = servicio.data && this.compararFechas(servicio.data, texto);
         return coincideIzena || coincideEtxeko || coincideKanpoko || coincideId || coincideFecha;
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
 
   this.serviciosFiltrados.sort((a, b) => {
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
 
 async eliminarProducto() {
   const alert = await this.alertController.create({
     header: '¿Estás seguro?',
     message: 'Se borrará el producto.',
     buttons: [
       {
         text: 'Cancelar',
         role: 'cancel',
       },
       {
         text: 'Confirmar',
         handler: async () => {
           const now = new Date();
           this.servicioSeleccionado.data = this.servicioSeleccionado.data || {};
           this.servicioSeleccionado.data.ezabatze_data = now;
 
           try {
             await firstValueFrom(this.servicioService.updateZerbitzuak(this.servicioSeleccionado));
             const index = this.servicios.findIndex(servicio => servicio.id === this.servicioSeleccionado.id);
             if (index !== -1) {
               this.servicios[index] = { ...this.servicioSeleccionado };
               this.aplicarFiltro({ target: { value: '' } });
             }
             this.editandoServicio = false;
             window.location.reload();
           } catch (error) {
             console.error('Error al borrar producto:', error);
           }
         },
       },
     ],
   });
   await alert.present();
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
 