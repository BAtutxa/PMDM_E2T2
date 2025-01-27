import { EquipoService } from './../services/equipos.service';
import { Component, OnInit } from '@angular/core';
import { LangileakService } from './../services/Langileak.service';
import { ITrabajador } from '../interfaces/ITrabajador';
import { IEquipos } from '../interfaces/IEquipos';

@Component({
  selector: 'app-langile',
  templateUrl: './langile.page.html',
  styleUrls: ['./langile.page.scss'],
})
export class LangilePage implements OnInit {
  langile: ITrabajador = {
    id: null,  
    izena: '',
    abizenak: '',
    kodea: '',
    data: {
      sortze_data: new Date(),
      eguneratze_data: new Date(),
      ezabatze_data: new Date(),
    }
  };

equipos: IEquipos [] = [];
equipo: IEquipos ={
  kodea: '',
  izena: '',
  data: {
    sortze_data: new Date(),
    eguneratze_data: new Date(),
    ezabatze_data: new Date(),
  },
  langileak: []
}

grupoId: string | undefined; 

equipoNombre !:string;

langileak: ITrabajador [] = []

  constructor(private langileakService: LangileakService, private equipoService: EquipoService) {}

  ngOnInit() {
    this.cargarEquipos();
  }

  cargarEquipos() {
    this.equipoService.grupos$.subscribe({
      next: (grupos) => {
        this.equipos = grupos;
        console.log('Grupos cargados:', grupos);

        const grupo = this.equipos.find(grupo => grupo.kodea === this.grupoId);
        if (grupo) {
          this.equipoNombre = grupo.kodea; 
        } else {
          console.error('Grupo no encontrado con el ID:', this.grupoId);
        }
      },
      error: (err) => {
        console.error('Error al cargar los grupos:', err);
      },
    });
  }

  seleccionarEquipo() {
    const equipoSeleccionado = this.equipos.find(equipo => equipo.kodea === this.equipoNombre);
    if (equipoSeleccionado) {
      this.langile.kodea = equipoSeleccionado.kodea; // Asigna el kodea al langile
      console.log('Equipo seleccionado:', equipoSeleccionado);
    }
  }

  crearLangile() {
  const ahora = new Date();

  this.langileakService.obtenerIDMaximo().subscribe((id) => {
    // Asignar ID y fechas originales (como objetos Date)
    this.langile.id = id;
    this.langile.data.sortze_data = ahora; // Asegúrate de que sea un objeto Date
    this.langile.data.eguneratze_data = ahora; // Asegúrate de que sea un objeto Date
    this.langile.data.ezabatze_data = null; // null también es aceptable

    // Crear el objeto para el backend, manteniendo las fechas como objetos Date
    const langileFormateado = {
      ...this.langile,
      data: {
        sortze_data: this.langile.data.sortze_data,
        eguneratze_data: this.langile.data.eguneratze_data,
        ezabatze_data: this.langile.data.ezabatze_data,
      },
    };

    console.log('Datos que se envían al backend:', langileFormateado);

    // Enviar el objeto formateado al backend
    this.langileakService.agregarLangile(langileFormateado).subscribe(
      (response: any) => {
        console.log('Respuesta del backend:', response);
        alert('Trabajador creado con éxito');
      },
      (error: any) => {
        console.log('Error al crear el trabajador:', error);
        alert('Error al crear el trabajador');
      }
    );
  });
}
}  
