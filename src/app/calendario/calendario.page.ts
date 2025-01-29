import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],

})
export class CalendarioPage implements OnInit {
  meses = [
    'Urtarrila', 'Otsaila', 'Martxoa', 'Apirila', 'Maiatza', 'Ekaina',
    'Uztaila', 'Abuztua', 'Iraila', 'Urria', 'Azaroa', 'Abendua',
  ];
  diasSemana = ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata'];
  
  anioActual: number = new Date().getFullYear(); //   anioActual: number = 1;
  mesActual: number = new Date().getMonth();
  diaSeleccionado: number | null = null;

  diasMes: number[] = [];
  grupoSeleccionado = '';
  citasSeleccionadas: string[] = [];
  
  // Variable para enlazar con el ion-datetime
  fechaSeleccionada: string = `${this.anioActual}-${(this.mesActual + 1).toString().padStart(2, '0')}-01`;

  // Definir las fechas mínimas y máximas si es necesario
  minFecha: string = `${this.anioActual - 1}-01-01`;
  maxFecha: string = `${this.anioActual + 1}-12-31`;

  constructor(private router: Router, private citaService: CitaService) {
    this.generarCalendario();
  }

  generarCalendario() {
    const inicioMes = new Date(this.anioActual, this.mesActual, 1).getDay();
    const diasEnMes = new Date(this.anioActual, this.mesActual + 1, 0).getDate();

    const dias = [];
    for (let i = 0; i < inicioMes; i++) {
      dias.push(0);
    }
    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(i);
    }

    this.diasMes = dias;
  }

  cambiarMes(incremento: number) {
    this.mesActual += incremento;

    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }

    this.diaSeleccionado = null;
    this.generarCalendario();
  }

  seleccionarDia(dia: number) {
    if (dia > 0) {
      this.diaSeleccionado = dia;
      this.obtenerCitasDeFecha(dia);
    }
  }

  // Método para manejar el cambio de fecha
onFechaChange(event: CustomEvent) {
  const fecha = new Date(event.detail.value); // Extraemos la fecha desde el evento
  this.anioActual = fecha.getFullYear();
  this.mesActual = fecha.getMonth();
  this.diaSeleccionado = fecha.getDate(); // Establecemos el día seleccionado

  // Actualizamos el calendario con la nueva fecha seleccionada
  this.obtenerCitasDeFecha(this.diaSeleccionado);
}


  irACitas() {
    if (this.diaSeleccionado !== null) {
      const fechaSeleccionada = `${this.anioActual}-${(this.mesActual + 1).toString().padStart(2, '0')}-${this.diaSeleccionado.toString().padStart(2, '0')}`;

      // Pasa la fecha seleccionada como query parameter al navegar
      this.router.navigate(['/citas'], { queryParams: { fecha: fechaSeleccionada } });
    } else {
      alert('Por favor selecciona un día');
    }
  }

  obtenerCitasDeFecha(dia: number) {
    const fechaSeleccionada = `${this.anioActual}-${(this.mesActual + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    
    this.citaService.getCitasPorFecha(fechaSeleccionada).subscribe(citas => {
      this.citasSeleccionadas = citas.map(cita => 
        `${cita.hasiera_ordua} - ${cita.amaiera_ordua}: ${cita.deskribapena}`
      );
    }, error => {
      console.error('Error al obtener citas:', error);
      this.citasSeleccionadas = ['Error al cargar las citas'];
    });
  }

  // Nueva función para navegar a 'gestionar-citas'
  irAGestionarCitas() {
    this.router.navigate(['/gestionar-citas']);
  }

  ngOnInit() {}
}
