import { LangileakService } from './../services/Langileak.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MaileguService } from '../services/mailegu.service';
import { IMaileguak } from '../interfaces/IMaileguak';
import { ITrabajador } from '../interfaces/ITrabajador';
import { IEMaterialak } from '../interfaces/IEMaterialak';
import { MaterialService } from '../services/materiales.service';
import { ActivatedRoute } from '@angular/router';
import { EsHistorialService } from '../services/EsHistorial.service';

@Component({
  selector: 'app-material-maileguak',
  templateUrl: './material-maileguak.page.html',
  styleUrls: ['./material-maileguak.page.scss'],
})
export class MaterialMaileguakPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;
 
   editandoIMailegu: boolean = false;
   IMaileguConInformacionSeleccionada: boolean = false;
   IMaileguSeleccionado: IMaileguak | any = {};
   IMaileguSeleccionadoAnterior: IMaileguak | null = null;
   maileguak: IMaileguak[] = [];
   maileguakFiltrados: IMaileguak[] = [];
   trabajadores :ITrabajador[] = [];
   materiales : IEMaterialak [] = [];
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
   editIMailegu!: string;
   details!: string;
   close!: string;
   acabaDeBorrar: boolean = false;
 
   constructor(private alertController: AlertController, 
     private translateService: TranslateService,
     private materialService : MaterialService,
     private userService: UserService,
     private maileguService : MaileguService,
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
     this.cargarmaileguak();
     this.cargarMateriales();
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
  
  obtenerNombreMaterial(materialId: number): string {
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
 
   async cargarmaileguak() {
     try {
       if(!this.esHistorial){
         const data = await firstValueFrom(this.maileguService.getMaileguak());
         this.maileguak = data;
         this.maileguakFiltrados = [...this.maileguak];
       }else{
         const data = await firstValueFrom(this.maileguService.getmailegusDelete());
         this.maileguak = data;
         this.maileguakFiltrados = [...this.maileguak];
       }
     } catch (error) {
       console.error('Error al cargar maileguak:', error);
     }
   }

   async cargarMateriales() {
    if(this.esHistorial){
      try {
        const data = await firstValueFrom(this.materialService.getMaterialesBorrados());
        this.materiales = data;
    } catch (error) {
      console.error('Error al cargar materiales:', error);
    }
    }else{
      try {
        const data = await firstValueFrom(this.materialService.getMateriales());
        this.materiales = data;
    } catch (error) {
      console.error('Error al cargar materiales:', error);
    }
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
     this.moverVistaAlPrimerIMailegu();
   }
   
   moverVistaAlPrimerIMailegu() {
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
 
 
   editarIMailegu(IMailegu: IMaileguak) {
     this.IMaileguSeleccionadoAnterior = { ...this.IMaileguSeleccionado }; 
     this.editandoIMailegu = true;
     this.IMaileguSeleccionado = { ...IMailegu };
 
     this.moverVistaAlPrimerIMailegu();
   }
 
   async confirmarEdicion() {
     const translations = await this.translateService.get(['IMailegu.HEADER', 'IMailegu.MESSAGE', 'PRODUCT.CANCEL', 'PRODUCT.CONFIRM']).toPromise();
     const alert = await this.alertController.create({
       header: translations['IMailegu.HEADER'],
       message: translations['IMailegu.MESSAGE'],
       buttons: [
         {
           text: translations['PRODUCT.CANCEL'],
           role: 'cancel',
         },
         {
           text: translations['PRODUCT.CONFIRM'],
           handler: async () => {
             const now = new Date().toISOString();
             this.IMaileguSeleccionado.data = this.IMaileguSeleccionado.data || {};
             this.IMaileguSeleccionado.data.eguneratze_data = now;
 
             try {
               await firstValueFrom(this.maileguService.actualizarmailegu(this.IMaileguSeleccionado));
               const index = this.maileguak.findIndex(IMailegu => IMailegu.id === this.IMaileguSeleccionado.id);
               if (index !== -1) {
                 this.maileguak[index] = { ...this.IMaileguSeleccionado };
                 this.aplicarFiltro({ target: { value: '' } });
               }
               this.editandoIMailegu = false;
               window.location.reload();
             } catch (error) {
               console.error('Error al actualizar IMailegu:', error);
             }
           },
         },
       ],
     });
 
     await alert.present();
   }
 
   cancelarEdicion() {
     this.IMaileguSeleccionado = { ...this.IMaileguSeleccionadoAnterior };
     this.editandoIMailegu = false;
   
     if (this.content && this.IMaileguSeleccionado.id) {
       const IMaileguIndex = this.maileguak.findIndex(p => p.id === this.IMaileguSeleccionado.id);
       if (IMaileguIndex !== -1) {
         const IMaileguElemento = document.getElementById(`ficha-${this.IMaileguSeleccionado.id}`);
         if (IMaileguElemento) {
           IMaileguElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
         }
       }
     }
   }
   
   aplicarFiltro(event: any) {
    const texto = event.target.value.toLowerCase().trim();
  
    if (texto === '') {
      this.maileguakFiltrados = [...this.maileguak];
    } else {
      this.maileguakFiltrados = this.maileguak.filter((IMailegu) => {
        const nombreLangile = this.obtenerNombreLangile(IMailegu.idLangilea).toLowerCase();
        const nombreMaterial = this.obtenerNombreMaterial(IMailegu.materiala_id).toLowerCase();
        const coincideLangileIzena = nombreLangile.includes(texto);
        const coincideMaterialIzena = nombreMaterial.includes(texto);
        const coincideId = IMailegu.id && IMailegu.id.toString().includes(texto);
        const coincideFecha = IMailegu.data && this.compararFechas(IMailegu.data, texto);
  
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
   
 
   async eliminarIMailegu() {
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
             this.IMaileguSeleccionado.data = this.IMaileguSeleccionado.data || {};
             this.IMaileguSeleccionado.data.ezabatze_data = now;
   
             try {
               console.log('prestamo antes de actualizar:', this.IMaileguSeleccionado);
               await firstValueFrom(this.maileguService.actualizarmailegu(this.IMaileguSeleccionado));
               const index = this.maileguak.findIndex(producto => producto.id === this.IMaileguSeleccionado.id);
               if (index !== -1) {
                 this.maileguak[index] = { ...this.IMaileguSeleccionado };
                 console.log('prestamo actualizado en la lista:', this.maileguak[index]);
                 this.aplicarFiltro({ target: { value: '' } });
               }
               this.editandoIMailegu = false;
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
 
   async trueEliminarIMailegu() {
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
               await firstValueFrom(this.maileguService.trueEliminarmailegu(this.IMaileguSeleccionado));
   
               this.maileguak = this.maileguak.filter(ficha => ficha.id !== this.IMaileguSeleccionado.id);
               this.acabaDeBorrar = true; 
               this.editandoIMailegu = false;
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
       'IMailegu.TITLE',
       'IMailegu.LABEL',
       'IMailegu.EDIT',
       'IMailegu.DETAILS',
       'IMailegu.CLOSE',
       'PRODUCT.NAME',
       'PRODUCT.CD',
       'PRODUCT.UD',
       'PRODUCT.EDIT',
       'PRODUCT.CONFIRM',
       'PRODUCT.CANCEL',
       'PRODUCT.INFO',
       'PRODUCT.SEARCH'
     ]).subscribe((translations: { [key: string]: any; }) => {
       this.title = translations['IMailegu.TITLE'];
       this.name = translations['PRODUCT.NAME'];
       this.editIMailegu = translations['IMailegu.EDIT'];
       this.close = translations['IMailegu.CLOSE'];
       this.details = translations['IMailegu.DETAILS'];
       this.label = translations['IMailegu.LABEL'];
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
