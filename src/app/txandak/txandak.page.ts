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
    // this.cargarOrdutegi(); // Primero cargamos los ordutegiak
  }

}
