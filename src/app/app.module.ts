import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './footer/footer.component';

import { provideHttpClient, HttpClient } from '@angular/common/http';

// Importaciones para ngx-translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalFichaComponent } from './modal-ficha-component/modal-ficha-component.component';

// Agregar FormsModule para que se reconozcan las directivas ngModel
import { FormsModule } from '@angular/forms';

// Factory para cargar archivos JSON de traducción
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json'); // Ruta a tus archivos JSON de traducción
}

@NgModule({
  declarations: [AppComponent, FooterComponent, ModalFichaComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule, // Importa FormsModule
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient], // Define HttpClient como dependencia
      },
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(), // Configuración del cliente HTTP
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
