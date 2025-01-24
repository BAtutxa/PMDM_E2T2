import { Component, OnInit } from '@angular/core';
import { EquipoService } from './../services/equipos.service';
import { IEquipos } from './../interfaces/IEquipos';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {
  grupos: IEquipos[] = []; // Lista de grupos

  constructor(private equipoService: EquipoService) {}

  ngOnInit(): void {
    this.cargarGrupos(); // Cargar los grupos al inicializar
  }

  cargarGrupos(): void {
    this.equipoService.grupos$.subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        console.log('Grupos cargados:', grupos);
      },
      error: (err) => {
        console.error('Error al cargar los grupos:', err);
      },
    });
  }

  crearGrupo() {
  }

  editarGrupo(index: number) {

  }

  eliminarGrupo(index: number) {
  }
}
