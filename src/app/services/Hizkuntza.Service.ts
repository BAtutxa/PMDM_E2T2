import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class HizkuntzaService {
  constructor(private translateService: TranslateService) {
    const savedLang = this.getHizkuntza(); // Cargar idioma guardado
    this.translateService.use(savedLang);
  }

  setHizkuntza(lang: string): void {
    this.translateService.use(lang);
    localStorage.setItem('language', lang);
  }

  getHizkuntza(): string {
    return localStorage.getItem('language') || 'eu'; 
  }
}
