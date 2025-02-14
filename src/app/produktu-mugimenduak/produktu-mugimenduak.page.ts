import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ITrabajador } from '../interfaces/ITrabajador';
import { IEProduktuak } from '../interfaces/IEProduktuak';
import { AlertController, IonContent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ProductoService } from '../services/productos.service';
import { UserService } from '../services/user.service';
import {IPM}  from '../interfaces/IPM';
import { IPMService } from '../services/ProduktuMugimendu.service';
import { LangileakService } from '../services/Langileak.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EsHistorialService } from '../services/EsHistorial.service';

@Component({
  selector: 'app-produktu-mugimenduak',
  templateUrl: './produktu-mugimenduak.page.html',
  styleUrls: ['./produktu-mugimenduak.page.scss'],
})
export class ProduktuMugimenduakPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;
   
     editandoIPM: boolean = false;
     IPMConInformacionSeleccionada: boolean = false;
     IPMSeleccionado: IPM | any = {};
     IPMSeleccionadoAnterior: IPM | null = null;
     maileguak: IPM[] = [];
     maileguakFiltrados: IPM[] = [];
     trabajadores :ITrabajador[] = [];
     materiales : IEProduktuak[] = [];
     mobilaDa: Boolean = false;
     ordenActual: { columna: string, ascendente: boolean } = { columna: 'id', ascendente: true };
     maileguakPorPagina = 10;
     paginaActual = 1;
     paginacionMaxima = 0;
     Math: any;
     esProfe :boolean = false;
     esHistorial :boolean = false;
   
   
     // Traducciones
     title!: string;
     name!: string;
     search!: string;
     info!: string;
     cancel!: string;
     confirm!: string;
     cd!: string;
     ud!: string;
     label!: string;
     editIPM!: string;
     details!: string;
     close!: string;
     acabaDeBorrar: boolean = false;
   
     constructor(private alertController: AlertController, 
       private translateService: TranslateService,
       private productoService : ProductoService,
       private userService: UserService,
       private ipmService : IPMService,
       private langileakService : LangileakService,
       private route: ActivatedRoute,
       private historialService: EsHistorialService,
     ) {}
   
     ngOnInit() {
        // Leer el parámetro "desdeHistorial" de la URL
      this.route.queryParams.subscribe(params => {
        this.esHistorial = params['desdeHistorial'] === 'true';
        this.historialService.setEsHistorial(this.esHistorial);
        console.log("Historial:", this.esHistorial);
      });
       this.VerSiEsProfe();
       this.mobilbista();
       this.cargarIPM();
       this.cargarProductos();
       this.cargarTrabajadores();
       this.translateLabels();
       this.translateService.setDefaultLang('es');
       this.translateService.use('eu');
     }
   
     VerSiEsProfe(){
       const rola = this.userService.getRola().rola;
      
       if(rola === 'IR'){
         this.esProfe = true;
       }else{
         this.esProfe = false;
       }
     }
     
     obtenerNombreLangile(langileId: number): string {
      const langile = this.trabajadores.find(t => t.id === langileId);
      return langile ? `${langile.izena} ${langile.abizenak}` : '-';
    }
    
    obtenerNombreProducto(materialId: number): string {
      const material = this.materiales.find(m => m.id === materialId);
      return material ? material.izena : '-';
    }
    
   
     @HostListener('window:resize', ['$event'])
     onResize() {
       this.mobilbista();
     }
   
     mobilbista() {
       this.mobilaDa = window.innerWidth <= 768;
     }
   
     async cargarIPM() {
       try {
         if(!this.esHistorial){
           const data = await firstValueFrom(this.ipmService.getIPM());
           this.maileguak = data;
           this.maileguakFiltrados = [...this.maileguak];
         }else{
           const data = await firstValueFrom(this.ipmService.getIPMBorrados());
           this.maileguak = data;
           this.maileguakFiltrados = [...this.maileguak];
         }
       } catch (error) {
         console.error('Error al cargar maileguak:', error);
       }
     }
  
     async cargarProductos() {
      try {
          const data = await firstValueFrom(this.productoService.getProductos());
          this.materiales = data;
      } catch (error) {
        console.error('Error al cargar materiales:', error);
      }
    }
  
    
    cargarTrabajadores() {
      this.langileakService.getLangileak().subscribe(trabajadores => {
        this.trabajadores = trabajadores;
      });
    }
  
   
     cambiarPagina(pagina: number) {
       if (pagina < 1) {
         this.paginaActual = 1;
       } else if (pagina > Math.ceil(this.maileguakFiltrados.length / this.maileguakPorPagina)) {
         this.paginaActual = Math.ceil(this.maileguakFiltrados.length / this.maileguakPorPagina);
       } else {
         this.paginaActual = pagina;
       }
       this.moverVistaAlPrimerIPM();
     }
     
     moverVistaAlPrimerIPM() {
       if (this.content) {
         this.content.scrollToTop(500); 
       }
     }
   
     hacerPaginacion() {
       this.paginacionMaxima = Math.ceil(this.maileguakFiltrados.length / this.maileguakPorPagina);
       let paginacion = [];
       for (let i = 1; i <= this.paginacionMaxima; i++) {
         paginacion.push(i);
       }
       return paginacion;
     }
   
   
     editarIPM(ipm: IPM) {
      this.editandoIPM = true; // Activar el modo de edición
      this.IPMSeleccionado = { ...ipm }; // Copiar los datos del IPM seleccionado
    
      // Formatear las fechas si es necesario
      if (this.IPMSeleccionado.hasieraData) {
        this.IPMSeleccionado.hasieraData = this.formatearFecha(this.IPMSeleccionado.hasieraData);
      }
      if (this.IPMSeleccionado.amaieraData) {
        this.IPMSeleccionado.amaieraData = this.formatearFecha(this.IPMSeleccionado.amaieraData);
      }
    }

    formatearFecha(fecha: any): string {
      if (fecha instanceof Date) {
        return fecha.toISOString().split('T')[0]; // Convertir Date a 'YYYY-MM-DD'
      } else if (typeof fecha === 'string') {
        return fecha.split('T')[0]; // Si es un string ISO, extraer la parte de la fecha
      }
      return fecha; // Devolver la fecha tal cual si ya está en el formato correcto
    }
   
    async confirmarEdicion() {
      const translations = await this.translateService
        .get(['IPM.HEADER', 'IPM.MESSAGE', 'PRODUCT.CANCEL', 'PRODUCT.CONFIRM'])
        .toPromise();
    
      const alert = await this.alertController.create({
        header: translations['IPM.HEADER'],
        message: translations['IPM.MESSAGE'],
        buttons: [
          {
            text: translations['PRODUCT.CANCEL'],
            role: 'cancel',
          },
          {
            text: translations['PRODUCT.CONFIRM'],
            handler: async () => {
              try {
                // Actualizar la fecha de modificación
                const now = new Date().toISOString();
                this.IPMSeleccionado.data = this.IPMSeleccionado.data || {};
                this.IPMSeleccionado.data.eguneratze_data = now;
    
                // Enviar la solicitud al backend
                const response = await firstValueFrom(
                  this.ipmService.actualizarIPM(this.IPMSeleccionado)
                );
    
                // Verificar si la respuesta es válida
                if (!response) {
                  throw new Error('El backend no devolvió una respuesta válida.');
                }
    
                // Actualizar la lista local de IPMs
                const index = this.maileguak.findIndex(
                  (IPM) => IPM.id === this.IPMSeleccionado.id
                );
                if (index !== -1) {
                  this.maileguak[index] = { ...this.IPMSeleccionado };
                  this.aplicarFiltro({ target: { value: '' } }); // Refrescar el filtro
                }
    
                // Desactivar el modo de edición
                this.editandoIPM = false;
    
                // Recargar la página (opcional, dependiendo de tu flujo)
                window.location.reload();
              } catch (error) {
                console.error('Error al actualizar IPM:', error);
    
                // Mostrar un mensaje de error al usuario
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'No se pudo actualizar el IPM. Por favor, inténtalo de nuevo.',
                  buttons: ['OK'],
                });
                await errorAlert.present();
              }
            },
          },
        ],
      });
    
      await alert.present();
    }
   
     cancelarEdicion() {
       this.IPMSeleccionado = { ...this.IPMSeleccionadoAnterior };
       this.editandoIPM = false;
     
       if (this.content && this.IPMSeleccionado.id) {
         const IPMIndex = this.maileguak.findIndex(p => p.id === this.IPMSeleccionado.id);
         if (IPMIndex !== -1) {
           const IPMElemento = document.getElementById(`ficha-${this.IPMSeleccionado.id}`);
           if (IPMElemento) {
             IPMElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
           }
         }
       }
     }
     
     aplicarFiltro(event: any) {
      const texto = event.target.value.toLowerCase().trim();
    
      if (texto === '') {
        this.maileguakFiltrados = [...this.maileguak];
      } else {
        this.maileguakFiltrados = this.maileguak.filter((IPM) => {
          const nombreLangile = this.obtenerNombreLangile(IPM.langilea).toLowerCase();
          const nombreMaterial = this.obtenerNombreProducto(IPM.produktuak).toLowerCase();
          const coincideLangileIzena = nombreLangile.includes(texto);
          const coincideMaterialIzena = nombreMaterial.includes(texto);
          const coincideId = IPM.id && IPM.id.toString().includes(texto);
          const coincideFecha = IPM.data && this.compararFechas(IPM.data, texto);
    
          return coincideLangileIzena || coincideMaterialIzena || coincideId || coincideFecha;
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
     
   
     async eliminarIPM() {
       const alert = await this.alertController.create({
         header: '¿Estás seguro?',
         message: 'Se borrará el prestamo.',
         buttons: [
           {
             text: 'Cancelar',
             role: 'cancel',
           },
           {
             text: 'Confirmar',
             handler: async () => {
               const now = new Date();
               this.IPMSeleccionado.data = this.IPMSeleccionado.data || {};
               this.IPMSeleccionado.data.ezabatze_data = now;
     
               try {
                 console.log('prestamo antes de actualizar:', this.IPMSeleccionado);
                 await firstValueFrom(this.ipmService.actualizarIPM(this.IPMSeleccionado));
                 const index = this.maileguak.findIndex(producto => producto.id === this.IPMSeleccionado.id);
                 if (index !== -1) {
                   this.maileguak[index] = { ...this.IPMSeleccionado };
                   console.log('prestamo actualizado en la lista:', this.maileguak[index]);
                   this.aplicarFiltro({ target: { value: '' } });
                 }
                 this.editandoIPM = false;
                 window.location.reload();
               } catch (error) {
                 console.error('Error al borrar el prestamo:', error);
               }
             },
           },
         ],
       });
       await alert.present();
     }
   
     async trueEliminarIPM() {
       const alert = await this.alertController.create({
         header: '¿Estás seguro?',
         message: 'Se borrará definitivamente el prestamo y no se podrá recuperar.',
         buttons: [
           {
             text: 'Cancelar',
             role: 'cancel',
           },
           {
             text: 'Confirmar',
             handler: async () => {
               try {
                 await firstValueFrom(this.ipmService.trueEliminarIPM(this.IPMSeleccionado));
     
                 this.maileguak = this.maileguak.filter(ficha => ficha.id !== this.IPMSeleccionado.id);
                 this.acabaDeBorrar = true; 
                 this.editandoIPM = false;
               } catch (error) {
                 console.error('Error al borrar prestamo:', error);
               }
             },
           },
         ],
       });
     
       await alert.present();
     }
  
        // Ordenar trabajadores por nombre
      get trabajadoresOrdenados() {
        return this.trabajadores.slice().sort((a, b) => a.izena.localeCompare(b.izena));
      }
  
      // Ordenar materiales por nombre
      get materialesOrdenados() {
        return this.materiales.slice().sort((a, b) => a.izena.localeCompare(b.izena));
      }
  
   
     getOrdenClass(columna: string): string {
       if (this.ordenActual.columna === columna) {
         return this.ordenActual.ascendente ? 'orden-asc' : 'orden-desc';
       }
       return '';
     }
   
      // Método para cargar las traducciones
      translateLabels() {
       this.translateService.get([
         'IPM.TITLE',
         'IPM.LABEL',
         'IPM.EDIT',
         'IPM.DETAILS',
         'IPM.CLOSE',
         'PRODUCT.NAME',
         'PRODUCT.CD',
         'PRODUCT.UD',
         'PRODUCT.EDIT',
         'PRODUCT.CONFIRM',
         'PRODUCT.CANCEL',
         'PRODUCT.INFO',
         'PRODUCT.SEARCH'
       ]).subscribe((translations: { [key: string]: any; }) => {
         this.title = translations['IPM.TITLE'];
         this.name = translations['PRODUCT.NAME'];
         this.editIPM = translations['IPM.EDIT'];
         this.close = translations['IPM.CLOSE'];
         this.details = translations['IPM.DETAILS'];
         this.label = translations['IPM.LABEL'];
         this.cd = translations['PRODUCT.CD'];
         this.ud = translations['PRODUCT.UD'];
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
