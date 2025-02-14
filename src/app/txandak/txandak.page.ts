import { Component, OnInit } from '@angular/core';
import { Itxandak } from '../interfaces/ITxandak';
import { Observable } from 'rxjs';
import { TxandaService } from '../services/txanda.service';
import { ITrabajador } from '../interfaces/ITrabajador';
import { LangileakService } from '../services/Langileak.service';

@Component({
  selector: 'app-txandak',
  templateUrl: './txandak.page.html',
  styleUrls: ['./txandak.page.scss'],
})
export class TxandakPage implements OnInit {
  txanda: Itxandak = {
    id: null,
    mota: '',
    dataSimple: new Date(), // Asegurar que es un objeto Date
    langilea: {
      kodea: '',
      id: null,
      izena: '',
      abizenak: '',
      data: {
        sortze_data: new Date(),
        eguneratze_data: new Date(),
        ezabatze_data: new Date(),
      }
    },
    data: {
      sortze_data: new Date(),
      eguneratze_data: new Date(),
      ezabatze_data: new Date(),
    },
  };

  txandak: Itxandak[] = [];
  selectedTxandak: Itxandak | null = null;
  txandakObservable!: Observable<Itxandak[]>;
  trabajadorObservable!: Observable<ITrabajador[]>;
  editando: boolean = false;
  editingTxanda!: Itxandak;
  trabajadores: ITrabajador[] = [];
  editingTxandak!: Itxandak;

  constructor(private txandaService: TxandaService, private trabajadorService: LangileakService) {}

  ngOnInit() {
    this.cargarTxandak();
    this.cargarTrabajadores();
  }

  onTxandaChange(event: any) {
    this.selectedTxandak = event.detail.value;
  }

  cargarTxandak() {
    this.txandakObservable = this.txandaService.getTxandaActivos();
    this.txandaService.getTxandaActivos().subscribe(data => {
      this.txandak = data.map(txanda => ({
        ...txanda,
        dataSimple: txanda.dataSimple ? new Date(txanda.dataSimple) : null, // Convierte string a Date o asigna null
      }));
    }, error => {
      console.error('Error al cargar txandak:', error);
    });
  }
  

  cargarTrabajadores() {
    this.trabajadorObservable = this.trabajadorService.getLangileak();
    this.trabajadorService.getLangileak().subscribe(data => {
      this.trabajadores = data;
    }, error => {
      console.error('Error al cargar trabajadores:', error);
    });
  }

  editarTxanda(txanda: Itxandak) {
    this.editingTxanda = { 
      ...txanda,
      dataSimple: txanda.dataSimple ? new Date(txanda.dataSimple) : null, // Convertir a Date
    };
    this.editando = true;
  }

  guardarCambios() {
    if (!this.editingTxanda) {
      alert("No hay ningún txanda en edición.");
      return;
    }

   

   // Función para asegurar que dataSimple siempre sea un Date o null
const formatFecha = (fecha: any): Date | null => {
  if (!fecha) return null;
  if (fecha instanceof Date) return fecha; // Si ya es Date, lo dejamos igual
  if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return new Date(fecha + 'T00:00:00'); // Convertir string a Date
  }
  return null;
};

// Crear objeto actualizado
const txandaToUpdate: Itxandak = {
  ...this.editingTxanda,
  dataSimple: formatFecha(this.editingTxanda.dataSimple), // Ahora devuelve un Date | null
};

    console.log("Enviando actualización al servidor:", txandaToUpdate);

    this.txandaService.actualizarTxanda(txandaToUpdate).subscribe({
      next: (response) => {
        console.log("Respuesta del servidor:", response);

        // Actualizar txandak en la lista
        const index = this.txandak.findIndex(o => o.id === response.id);
        if (index !== -1) {
          this.txandak[index] = response;
        }

        alert("El txanda ha sido actualizado correctamente.");
        this.editando = false;
        window.location.reload();
      },
      error: (error: any) => {
        console.error('Error al actualizar el txanda:', error);
        alert("Hubo un error al actualizar el txanda.");
      }
    });
  }
}
