import { Component } from '@angular/core';
import { HizkuntzaService } from './services/hizkuntza.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private hizkuntzaService: HizkuntzaService, private translateService: TranslateService) {
    const lang = this.hizkuntzaService.getHizkuntza();
    console.log('Idioma cargado al inicio:', lang);
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
  }

  toggleLanguage() {
    const newLang = this.hizkuntzaService.getHizkuntza() === 'es' ? 'eu' : 'es';
    this.hizkuntzaService.setHizkuntza(newLang);
  }

  loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) {
      document.body.classList.add('dark');
    }
  }

  toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  }
}
