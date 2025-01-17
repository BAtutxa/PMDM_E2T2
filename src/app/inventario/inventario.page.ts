import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

 public inventoryTitle: string = '';
  public productLabel: string = '';
   public materialLabel: string = '';
 
   constructor(private translateService: TranslateService) {
     // Establecer el idioma predeterminado
     this.translateService.setDefaultLang('es');
     this.translateService.use('es'); // Usar el idioma predeterminado
   }
 
   ngOnInit() {
     this.translateLabels();
   }
 
   // Método para cargar las traducciones
   translateLabels() {
     this.translateService.get([
       'INVENTORY.TITLE',
       'INVENTORY.PRODUCT',
       'INVENTORY.MATERIAL',
     ]).subscribe(translations => {
       this.inventoryTitle = translations['INVENTORY.TITLE'];
       this.productLabel = translations['INVENTORY.PRODUCT'];
       this.materialLabel = translations['INVENTORY.MATERIAL'];
    
     });
   }
 
   // Método para cambiar el idioma dinámicamente
   changeLanguage(lang: string) {
     this.translateService.use(lang); // Cambiar el idioma
     this.translateLabels(); // Recargar las traducciones
   }
}
