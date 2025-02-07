import { UserService } from './../services/user.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { MaterialService } from '../services/materiales.service';
import { firstValueFrom } from 'rxjs';
import { IEMaterialak } from '../interfaces/IEMaterialak';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.page.html',
  styleUrls: ['./materiales.page.scss'],
})
export class MaterialesPage implements OnInit {

  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  editandoMaterial: boolean = false;
  MaterialConInformacionSeleccionada: boolean = false;
  materialSeleccionado: IEMaterialak | any = {};
  MaterialSeleccionadoAnterior: IEMaterialak | null = null;
  materiales: IEMaterialak[] = [];
  materialesFiltrados: IEMaterialak[] = [];
  mobilaDa: Boolean = false;
  ordenActual: { columna: string, ascendente: boolean } = { columna: 'id', ascendente: true };
  materialesPorPagina = 10;
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
  editMaterial!: string;
  details!: string;
  close!: string;
  acabaDeBorrar: boolean = false;

  constructor(private alertController: AlertController, 
    private MaterialService: MaterialService, 
    private translateService: TranslateService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.VerSiEsProfe();
    this.mobilbista();
    this.cargarMateriales();
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

  mobilbista() {
    this.mobilaDa = window.innerWidth <= 768;
  }

  async cargarMateriales() {
    try {
      if(!this.esHistorial){
        const data = await firstValueFrom(this.MaterialService.getMateriales());
        this.materiales = data;
        this.materialesFiltrados = [...this.materiales];
      }else{
        const data = await firstValueFrom(this.MaterialService.getMaterialesBorrados());
        this.materiales = data;
        this.materialesFiltrados = [...this.materiales];
      }
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


  editarMaterial(material: IEMaterialak) {
    this.MaterialSeleccionadoAnterior = { ...this.materialSeleccionado }; 
    this.editandoMaterial = true;
    this.materialSeleccionado = { ...material };

    this.moverVistaAlPrimerMaterial();
  }

  async confirmarEdicion() {
    const translations = await this.translateService.get(['MATERIAL.HEADER', 'MATERIAL.MESSAGE', 'PRODUCT.CANCEL', 'PRODUCT.CONFIRM']).toPromise();
    const alert = await this.alertController.create({
      header: translations['MATERIAL.HEADER'],
      message: translations['MATERIAL.MESSAGE'],
      buttons: [
        {
          text: translations['PRODUCT.CANCEL'],
          role: 'cancel',
        },
        {
          text: translations['PRODUCT.CONFIRM'],
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
              window.location.reload();
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
          materialElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        const coincideId = material.id && material.id.toString().includes(texto);
        const coincideEtiqueta = material.etiketa && material.etiketa.toString().includes(texto);
        const coincideFecha = material.data && this.compararFechas(material.data, texto);
  
        return coincideIzena ||  coincideId || coincideEtiqueta || coincideFecha;
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
    if (this.ordenActual.columna === columna) {
      this.ordenActual.ascendente = !this.ordenActual.ascendente;
    } else {
      this.ordenActual.columna = columna;
      this.ordenActual.ascendente = true;
    }
  
    this.materialesFiltrados.sort((a, b) => {
      let valorA = (a as any)[columna];
      let valorB = (b as any)[columna];
  
      if (columna === 'id') {
        valorA = Number(valorA);
        valorB = Number(valorB);
      }
  
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

  async eliminarMaterial() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se borrará el material.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const now = new Date();
            this.materialSeleccionado.data = this.materialSeleccionado.data || {};
            this.materialSeleccionado.data.ezabatze_data = now;
  
            try {
              console.log('Material antes de actualizar:', this.materialSeleccionado);
              await firstValueFrom(this.MaterialService.actualizarMaterial(this.materialSeleccionado));
              const index = this.materiales.findIndex(producto => producto.id === this.materialSeleccionado.id);
              if (index !== -1) {
                this.materiales[index] = { ...this.materialSeleccionado };
                console.log('Material actualizado en la lista:', this.materiales[index]);
                this.aplicarFiltro({ target: { value: '' } });
              }
              this.editandoMaterial = false;
              window.location.reload();
            } catch (error) {
              console.error('Error al borrar el material:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async trueEliminarMaterial() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se borrará definitivamente el material y no se podrá recuperar.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            try {
              await firstValueFrom(this.MaterialService.trueEliminarMaterial(this.materialSeleccionado));
  
              this.materiales = this.materiales.filter(ficha => ficha.id !== this.materialSeleccionado.id);
              this.acabaDeBorrar = true; 
              this.editandoMaterial = false;
            } catch (error) {
              console.error('Error al borrar material:', error);
            }
          },
        },
      ],
    });
  
    await alert.present();
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
      'MATERIAL.TITLE',
      'MATERIAL.LABEL',
      'MATERIAL.EDIT',
      'MATERIAL.DETAILS',
      'MATERIAL.CLOSE',
      'PRODUCT.NAME',
      'PRODUCT.CD',
      'PRODUCT.UD',
      'PRODUCT.EDIT',
      'PRODUCT.CONFIRM',
      'PRODUCT.CANCEL',
      'PRODUCT.INFO',
      'PRODUCT.SEARCH'
    ]).subscribe((translations: { [key: string]: any; }) => {
      this.title = translations['MATERIAL.TITLE'];
      this.name = translations['PRODUCT.NAME'];
      this.editMaterial = translations['MATERIAL.EDIT'];
      this.close = translations['MATERIAL.CLOSE'];
      this.details = translations['MATERIAL.DETAILS'];
      this.label = translations['MATERIAL.LABEL'];
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
