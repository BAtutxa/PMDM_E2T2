import { Component, OnInit } from '@angular/core';
import { IEquipos } from '../interfaces/IEquipos';
import { EquipoService } from '../services/equipos.service';
import { Router } from '@angular/router';
import { ITrabajador } from '../interfaces/ITrabajador'; 
import { LangileakService } from '../services/Langileak.service';

@Component({
  selector: 'app-crear-grupos',
  templateUrl: './crear-grupos.page.html',
  styleUrls: ['./crear-grupos.page.scss'],
})
export class CrearGruposPage implements OnInit {
  ficha: IEquipos = {
    kodea: '',  // Ya lo definimos como string
    izena: '',
    data: {
      sortze_data: new Date(),
      eguneratze_data: new Date(),
      ezabatze_data: null,
    },
    langileak: [] // Inicialmente vacío
  };

  trabajadores: ITrabajador[] = []; // Lista de trabajadores disponibles

  constructor(
    private equipoService: EquipoService, 
    private router: Router,
    private langileakService : LangileakService
  ) {}

  ngOnInit() {
    // Aquí cargamos los trabajadores desde el servicio
    this.cargarTrabajadores();
  }

  cargarTrabajadores() {
    // Asegúrate de que tienes un método en el servicio para obtener los trabajadores
    this.langileakService.getLangileak().subscribe(
      (trabajadores: ITrabajador[]) => {
        this.trabajadores = trabajadores;
      },
      (error) => {
        console.error('Error al cargar los trabajadores:', error);
      }
    );
  }

  guardarEquipo() {
    // Obtener el siguiente 'kodea' disponible
    this.equipoService.obtenerIDDisponible().subscribe((nextId: string) => {
      // Asignar el siguiente 'kodea' disponible a la ficha
      this.ficha.kodea = nextId;

      // Ahora procederemos a guardar el equipo con el 'kodea' correcto
      this.equipoService.agregarGrupo(this.ficha).subscribe(
        (response: any) => {
          window.location.reload();
          alert('Equipo guardado correctamente');
        },
        (error: any) => {
          console.error('Error al guardar el equipo:', error);
        }
      );
    });
  }

  resetFormulario() {
    // Reiniciar el formulario después de guardar el equipo
    this.ficha = {
      kodea: '',
      izena: '',
      data: {
        sortze_data: new Date(),
        eguneratze_data: new Date(),
        ezabatze_data: null,
      },
      langileak: [],
    };
  }
}
