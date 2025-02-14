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
    data: new Date(), // Asegurar que es un objeto Date
    langileak: {
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
    dataSimple: {
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
      console.log('Datos recibidos del servidor:', data);
  
      this.txandak = data.map(txanda => {
        // Extraer las fechas de 'dataSimple' en lugar de 'data'
        const sortzeDataStr = txanda.dataSimple?.sortze_data ?? '';  // Si es null, asignamos una cadena vacía
        const eguneratzeDataStr = txanda.dataSimple?.eguneratze_data ?? ''; 
        const ezabatzeDataStr = txanda.dataSimple?.ezabatze_data ?? ''; 
  
        // Mostrar las fechas para depuración
        console.log('Fechas desde el servidor:', { sortzeDataStr, eguneratzeDataStr, ezabatzeDataStr });
  
        // Verifica que las fechas sean cadenas no vacías antes de convertirlas a Date
        const sortzeDataDate = (typeof sortzeDataStr === 'string' && sortzeDataStr.trim()) ? new Date(sortzeDataStr) : null;
        const eguneratzeDataDate = (typeof eguneratzeDataStr === 'string' && eguneratzeDataStr.trim()) ? new Date(eguneratzeDataStr) : null;
        const ezabatzeDataDate = (typeof ezabatzeDataStr === 'string' && ezabatzeDataStr.trim()) ? new Date(ezabatzeDataStr) : null;
  
        // Validación de si las fechas son válidas
        const isValidSortzeData = sortzeDataDate && !isNaN(sortzeDataDate.getTime());
        const isValidEguneratzeData = eguneratzeDataDate && !isNaN(eguneratzeDataDate.getTime());
        const isValidEzabatzeData = ezabatzeDataDate && !isNaN(ezabatzeDataDate.getTime());
  
        console.log('Fechas convertidas:', { sortzeDataDate, eguneratzeDataDate, ezabatzeDataDate });
  
        return {
          ...txanda,
          dataSimple: {
            sortze_data: isValidSortzeData ? sortzeDataDate : null,
            eguneratze_data: isValidEguneratzeData ? eguneratzeDataDate : null,
            ezabatze_data: isValidEzabatzeData ? ezabatzeDataDate : null
          }
        };
      });
    }, error => {
      console.error('Error al cargar txandak:', error);
    });
  }
  
  cargarTrabajadores() {
    this.trabajadorObservable = this.trabajadorService.getLangileak();
    this.trabajadorService.getLangileak().subscribe(data => {
      this.trabajadores = data;
      console.log("Trabajadores:", this.trabajadores);
    }, error => {
      console.error('Error al cargar trabajadores:', error);
    });
  }

  editarTxanda(txanda: Itxandak) {
    this.editingTxanda = { 
      ...txanda,
      dataSimple: txanda.dataSimple ? {
        sortze_data: txanda.dataSimple.sortze_data ? new Date(txanda.dataSimple.sortze_data) : new Date(),
        eguneratze_data: txanda.dataSimple.eguneratze_data ? new Date(txanda.dataSimple.eguneratze_data) : new Date(),
        ezabatze_data: txanda.dataSimple.ezabatze_data ? new Date(txanda.dataSimple.ezabatze_data) : new Date(),
      } : {
        sortze_data: new Date(),
        eguneratze_data: new Date(),
        ezabatze_data: new Date(),
      },
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
      dataSimple: {
        sortze_data: formatFecha(this.editingTxanda.dataSimple.sortze_data), // Ahora devuelve un Date | null
        eguneratze_data: formatFecha(this.editingTxanda.dataSimple.eguneratze_data),
        ezabatze_data: formatFecha(this.editingTxanda.dataSimple.ezabatze_data),
      },
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
