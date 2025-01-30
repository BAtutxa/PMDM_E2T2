export interface Zerbitzuak {
  id: number | null;               // ID del servicio (opcional, porque no lo necesitamos cuando creamos un nuevo servicio)
  izena: string;                  // Nombre del servicio
  etxeko_prezioa: number;         // Precio en casa
  kanpoko_prezioa: number;        // Precio fuera de casa
  data?: string;                  // Fecha (opcional, dependiendo del modelo de datos que manejes)
}
