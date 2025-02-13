import { Component, OnInit } from '@angular/core';
import { IOrdutegi } from '../interfaces/IOrdutegi';
import { Observable } from 'rxjs';
import { IEquipos } from '../interfaces/IEquipos';
import { OrdutegiService } from '../services/Ordutegi.service';
import { EquipoService } from '../services/equipos.service';

@Component({
  selector: 'app-ordutegi',
  templateUrl: './ordutegi.page.html',
  styleUrls: ['./ordutegi.page.scss'],
})
export class OrdutegiPage implements OnInit {
 ordutegi: IOrdutegi = {
    id: null,
    kodea: '',
    eguna: 0,
    hasiera_data: null,
    amaiera_data: null,
    denbora: {
      hasiera_ordua: null,
      amaiera_ordua: null,
    },
    data: {
      sortze_data: new Date(),
      eguneratze_data: new Date(),
      ezabatze_data: null
    }
  };

  ordutegiak: IOrdutegi[] = [];
  selectedOrdutegi: IOrdutegi | null = null;
  ordutegiObservable!: Observable<IOrdutegi[]>;
  equipoObservable!: Observable<IEquipos[]>;
  egunaString !:String;
  equipos: IEquipos[] = [];
  equipo !: IEquipos;
  editando: boolean = false;
  editingOrdutegi !: IOrdutegi;

  constructor(private ordutegiService: OrdutegiService, private equipoService: EquipoService) {}

  ngOnInit() {
    this.cargarOrdutegi(); // Primero cargamos los ordutegiak
  }

  egunaStringEgin(index: number): string {
    if (!this.ordutegiak || index >= this.ordutegiak.length || !this.ordutegiak[index]) {
      return "Desconocido";
    }
  
    let egunaString: string;
    switch(this.ordutegiak[index].eguna) {
      case 1: egunaString = "Lunes"; break;
      case 2: egunaString = "Martes"; break;
      case 3: egunaString = "Miércoles"; break;
      case 4: egunaString = "Jueves"; break;
      case 5: egunaString = "Viernes"; break;
      default: egunaString = "Desconocido"; break;
    }
    return egunaString;
  }
  cargarOrdutegi() {
    this.ordutegiObservable = this.ordutegiService.getOrdutegisActivos();
    this.ordutegiService.getOrdutegisActivos().subscribe(data => {
      this.ordutegiak = data; // Guardamos los ordutegiak
      if (this.ordutegiak.length > 0) {
        this.cargarGrupos(); // Llamamos a cargarGrupos después de que ordutegiak estén cargados
      } else {
        console.warn('No se encontraron ordutegiak.');
      }
    }, error => {
      console.error('Error al cargar ordutegiak:', error);
    });
  }

  cargarGrupos(): void {
    this.equipoService.grupos$.subscribe({
      next: (grupos) => {
        this.equipos = grupos;
        console.log('Grupos cargados:', grupos);

        // Buscar el grupo correspondiente al 'kodea' del primer 'ordutegi'
        const grupo = this.equipos.find(grupo => grupo.kodea === this.ordutegiak[0].kodea);
        if (grupo) {
          this.equipo = { ...grupo }; // Asignamos el grupo a la variable 'equipo'
        } else {
          console.error('Grupo no encontrado con el ID:', this.ordutegiak[0].kodea);
        }
      },
      error: (err) => {
        console.error('Error al cargar los grupos:', err);
      },
    });
  }

  onTxandaChange(event: any) {
    this.selectedOrdutegi = event.detail.value;
  }

  getEquipoNombre(kodea: string): string |null {
    const equipo = this.equipos.find(equipo => equipo.kodea === kodea);
    return equipo ? equipo.izena : 'Equipo no encontrado'; // Ajusta la propiedad 'nombre' según tu modelo de datos
  }

  editarOrdutegi(ordutegi: IOrdutegi) {
    // Formatear fechas a "yyyy-MM-dd" para el input type="date"
    const formatFechaParaInput = (fecha: string | Date | null): string => {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toISOString().split('T')[0]; // Formato "yyyy-MM-dd"
    };
  
    // Crear una copia del ordutegi y formatear fechas
    this.editingOrdutegi = {
      ...ordutegi,
      hasiera_data: formatFechaParaInput(ordutegi.hasiera_data),
      amaiera_data: formatFechaParaInput(ordutegi.amaiera_data),
    };
  
    this.editando = true;
  }
  

    guardarCambios() {
      if (!this.editingOrdutegi) {
          alert("No hay ningún ordutegi en edición.");
          return;
      }

      const { kodea, eguna, hasiera_data, amaiera_data, denbora } = this.editingOrdutegi;

      if (!kodea || !eguna || !hasiera_data || !amaiera_data || !denbora?.hasiera_ordua || !denbora?.amaiera_ordua) {
          alert('Por favor, completa todos los campos obligatorios.');
          return;
      }

      // Función para verificar si una fecha está en formato "yyyy-MM-dd"
      const isDateFormatValid = (fecha: any): boolean => {
          return typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha);
      };

      // Función para formatear fechas a "yyyy-MM-dd"
      const formatFecha = (fecha: any): string | null => {
          if (!fecha) return null;
          if (isDateFormatValid(fecha)) return fecha; // Si ya está en el formato correcto, no se formatea
          return new Date(fecha).toISOString().split('T')[0]; // Formatea a "yyyy-MM-dd"
      };

      // Función para verificar si una hora está en formato "HH:mm:ss"
      const isHoraFormatValid = (hora: string | null): boolean => {
          return typeof hora === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(hora);
      };

      // Función para formatear horas a "HH:mm:ss"
      const formatHora = (hora: string | null): string | null => {
          if (!hora) return null;
          if (isHoraFormatValid(hora)) return hora; // Si ya está en el formato correcto, no se formatea
          const [hours, minutes] = hora.split(":");
          return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`; // Formatea a "HH:mm:ss"
      };

      // Crear el objeto actualizado
      const ordutegiToUpdate: IOrdutegi = {
          ...this.editingOrdutegi,
          eguna: Number(this.editingOrdutegi.eguna), // Asegura que eguna sea un número
          hasiera_data: formatFecha(hasiera_data),
          amaiera_data: formatFecha(amaiera_data),
          denbora: {
              hasiera_ordua: formatHora(denbora.hasiera_ordua),
              amaiera_ordua: formatHora(denbora.amaiera_ordua)
          },
          data: {
              sortze_data: this.editingOrdutegi.data?.sortze_data || new Date(),
              eguneratze_data: new Date(),
              ezabatze_data: null
          }
      };

      console.log("Enviando actualización al servidor:", ordutegiToUpdate);

      // Enviar datos al backend para actualizar
      this.ordutegiService.actualizarOrdutegi(ordutegiToUpdate).subscribe({
          next: (response) => {
              console.log("Respuesta del servidor:", response);

              // Actualiza el ordutegi en la lista
              const index = this.ordutegiak.findIndex(o => o.id === response.id);
              if (index !== -1) {
                  this.ordutegiak[index] = response;
              }

              alert("El horario ha sido actualizado correctamente.");
              this.editando = false;
              window.location.reload();
          },
          error: (error: any) => {
              console.error('Error al actualizar el horario:', error);
              alert("Hubo un error al actualizar el horario.");
        }
    });
  }
}

