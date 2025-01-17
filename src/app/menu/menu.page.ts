import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public menuTitle: string = '';
  public inventoryLabel: string = '';
  public appointmentsLabel: string = '';
  public customersLabel: string = '';
  public servicesLabel: string = '';
  public ticketsLabel: string = '';
  public administrationLabel: string = '';

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
      'MENU.TITLE',
      'MENU.INVENTORY',
      'MENU.APPOINTMENTS',
      'MENU.CUSTOMERS',
      'MENU.SERVICES',
      'MENU.TICKETS',
      'MENU.ADMINISTRATION'
    ]).subscribe(translations => {
      this.menuTitle = translations['MENU.TITLE'];
      this.inventoryLabel = translations['MENU.INVENTORY'];
      this.appointmentsLabel = translations['MENU.APPOINTMENTS'];
      this.customersLabel = translations['MENU.CUSTOMERS'];
      this.servicesLabel = translations['MENU.SERVICES'];
      this.ticketsLabel = translations['MENU.TICKETS'];
      this.administrationLabel = translations['MENU.ADMINISTRATION'];
    });
  }

  // Método para cambiar el idioma dinámicamente
  changeLanguage(lang: string) {
    this.translateService.use(lang); // Cambiar el idioma
    this.translateLabels(); // Recargar las traducciones
  }
}
