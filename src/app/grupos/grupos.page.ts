import { Component, OnInit } from '@angular/core';

interface Integrante {
  id: number;
  nombre: string;
}

interface Grupo {
  nombre: string;
  integrantes: Integrante[];
}

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {
  grupos: Grupo[] = [];

  constructor() {}

  ngOnInit() {
    this.grupos = [
      {
        nombre: 'Talde 1',
        integrantes: [
          { id: 1, nombre: 'Juan' },
          { id: 2, nombre: 'Ana' },
          { id: 3, nombre: 'Luis' },
          { id: 4, nombre: 'Sofía' },
        ],
      },
      {
        nombre: 'Talde 2',
        integrantes: [
          { id: 5, nombre: 'Carlos' },
          { id: 6, nombre: 'Marta' },
          { id: 7, nombre: 'Pedro' },
          { id: 8, nombre: 'Lucía' },
        ],
      },
    ];
  }

  crearGrupo() {
    const nuevoGrupo: Grupo = {
      nombre: `Grupo ${this.grupos.length + 1}`,
      integrantes: [
        { id: Date.now(), nombre: 'Taldekide 1' },
        { id: Date.now() + 1, nombre: 'Taldekide 2' },
        { id: Date.now() + 2, nombre: 'Taldekide 3' },
        { id: Date.now() + 3, nombre: 'Taldekide 4' },
      ],
    };
    this.grupos.push(nuevoGrupo);
  }

  editarGrupo(index: number) {
    const grupo = this.grupos[index];
    const nuevoNombre = prompt('Talde berriaren izena:', grupo.nombre);
    if (nuevoNombre) {
      grupo.nombre = nuevoNombre;
      grupo.integrantes.forEach((integrante, i) => {
        const nuevoNombreIntegrante = prompt(
          `Taldekide honentzako izen berria: ${integrante.nombre}:`,
          integrante.nombre
        );
        if (nuevoNombreIntegrante) {
          integrante.nombre = nuevoNombreIntegrante;
        }
      });
    }
  }

  eliminarGrupo(index: number) {
    this.grupos.splice(index, 1);
  }
}
