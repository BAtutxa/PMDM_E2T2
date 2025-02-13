import { EquipoService } from './../services/equipos.service';
import { Component, OnInit } from '@angular/core';
import { IOrdutegi } from '../interfaces/IOrdutegi';
import { Observable } from 'rxjs';
import { OrdutegiService } from '../services/Ordutegi.service';
import { IEquipos } from '../interfaces/IEquipos';

@Component({
  selector: 'app-txandak',
  templateUrl: './txandak.page.html',
  styleUrls: ['./txandak.page.scss'],
})
export class TxandakPage implements OnInit {

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
      }
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
    this.editingOrdutegi = { ...ordutegi }; 
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

      // Formatear fechas y horas correctamente
      const formatFecha = (fecha: any): string | null => {
          return fecha ? new Date(fecha).toISOString().split('T')[0] : null;
      };

      const formatHora = (hora: string | null): string | null => {
          if (!hora) return null;
          const [hours, minutes] = hora.split(":");
          return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
      };

      // Crear el objeto actualizado
      const ordutegiToUpdate: IOrdutegi = {
          ...this.editingOrdutegi,
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
          next: () => {
              alert("El horario ha sido actualizado correctamente.");
              this.cargarOrdutegi(); // Recargar la lista de horarios
              this.editando = false;
          },
          error: (error: any) => {
              console.error('Error al actualizar el horario:', error);
              alert("Hubo un error al actualizar el horario.");
          }
      });
  }
}
