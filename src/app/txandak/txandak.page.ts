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

  

  sumarOrdutegi() {

    const nuevoTicket: IOrdutegi = {
      kodea: '1', // Asigna el valor adecuado para el código
      eguna: 1, // Asigna el día correspondiente
      hasiera_data: new Date(), // Asigna la fecha de inicio (puedes ajustar según sea necesario)
      amaiera_data: new Date(),
      id: null,
      denbora: {
        hasiera_ordua: null,
        amaiera_ordua: null
      },
      data: {
        eguneratze_data: new Date(),
        sortze_data : new Date(),
        ezabatze_data : null
      }
    };
  
    // Llamar a la función del servicio para crear el ordutegi
    this.ordutegiService.crearOrdutegi(nuevoTicket).subscribe(
      (respuesta) => {
        console.log('Ordutegi creado exitosamente:', respuesta);
        // Aquí puedes hacer algo con la respuesta, como mostrar un mensaje de éxito
      },
      (error) => {
        console.error('Error al crear el ordutegi:', error);
        // Manejar el error (por ejemplo, mostrar un mensaje de error)
      }
    );
  }
  

  getEquipoNombre(kodea: string): string |null {
    const equipo = this.equipos.find(equipo => equipo.kodea === kodea);
    return equipo ? equipo.izena : 'Equipo no encontrado'; // Ajusta la propiedad 'nombre' según tu modelo de datos
  }
}
