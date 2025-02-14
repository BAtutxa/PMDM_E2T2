import { Component, OnInit } from '@angular/core';
import { MaileguService } from '../services/mailegu.service';
import { IMaileguak } from '../interfaces/IMaileguak';
import { ITrabajador } from '../interfaces/ITrabajador';
import { LangileakService } from '../services/Langileak.service';
import { ClientesService } from '../services/clientes.service';
import { MaterialService } from '../services/materiales.service';
import { IEMaterialak } from '../interfaces/IEMaterialak';

@Component({
  selector: 'app-crear-maileguak',
  templateUrl: './crear-maileguak.page.html',
  styleUrls: ['./crear-maileguak.page.scss'],
})
export class CrearMaileguakPage implements OnInit {

  ordutegi: IMaileguak = {
    id: null,
    materiala_id: 0,
    idLangilea: 0,
    kodea: null,
    data: {
      sortze_data: null,
      eguneratze_data: null,
      ezabatze_data: null
    },
    hasieraData: null,
    amaieraData: null
  }
   
  
    langileak: ITrabajador[] = [];  
    maileguak: IMaileguak[] = []; 
    materialak: IEMaterialak[]=[];
  
    constructor(
      private maileguService: MaileguService,
      private langileService: LangileakService,
      private materialService: MaterialService

    ) {}
  
    ngOnInit() {
      this.cargarMaileguak();
      this.cargartrabajadores();
      this.cargarMateriales();
    }
  
   cargarMaileguak() {
    this.maileguService.getMaileguak().subscribe({
      next: (maileguak: IMaileguak[]) => {
        this.maileguak = maileguak;
        console.log('Mailegu cargados:', this.maileguak);
      },
      error: (error: any) => {
        console.error('Error al obtener Maileguak:', error);
      }
    });
  }

  cargartrabajadores() {
    this.langileService.getLangileak().subscribe({
      next: (trabajadores: ITrabajador[]) => {
        this.langileak = trabajadores;
        console.log('Mailegu cargados:', this.langileak);
      },
      error: (error: any) => {
        console.error('Error al obtener Maileguak:', error);
      }
    });
  }

  cargarMateriales() {
    this.materialService.getMateriales().subscribe({
      next: (materiales: IEMaterialak[]) => {
        this.materialak = materiales;
        console.log('Mailegu cargados:', this.materialak);
      },
      error: (error: any) => {
        console.error('Error al obtener Maileguak:', error);
      }
    });
  }
  
  
  guardarOrdutegi() {
    const { materiala_id, idLangilea, data, hasieraData, amaieraData } = this.ordutegi;
  
    if (!hasieraData || !amaieraData || !materiala_id || !idLangilea) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }
  
      // Función para formatear fechas como "YYYY-MM-DD"
      const formatFecha = (fecha: any): string | null => {
          return fecha ? new Date(fecha).toISOString().split('T')[0] : null;
      };
   
      const ordutegiToSend: IMaileguak = {
        ...this.ordutegi,
        hasieraData: hasieraData ? new Date(formatFecha(hasieraData)!) : null,
        amaieraData: amaieraData ? new Date(formatFecha(amaieraData)!) : null,
        data: {
          sortze_data: new Date(),
          eguneratze_data: new Date(),
          ezabatze_data: null // Puede ser null si se desea
        }
      };
      
  
      console.log("Enviando al servidor:", ordutegiToSend);
  
      this.maileguService.crearmailegu(ordutegiToSend).subscribe({
          next: () => {
              alert("El ordutegi ha sido creado.");
              this.resetOrdutegi();
              window.location.reload();
          },
          error: (error: any) => console.error('Error al crear el ordutegi:', error)
      });
  }
  
    resetOrdutegi() {
        this.ordutegi = {
              id: null,
        materiala_id: 0,
        idLangilea: 0,
        kodea: null,
        data: {
          sortze_data: null,
          eguneratze_data: null,
          ezabatze_data: null
        },
        hasieraData: null,
        amaieraData: null
        }
    }
}
