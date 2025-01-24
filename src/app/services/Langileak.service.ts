import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definir una interfaz para los datos de Langileak
interface Data {
  sortze_data: string | null;
  eguneratze_data: string | null;
  ezabatze_data: string | null;
}

interface Langileak {
  id: number;
  izena: string;
  kodea: string;
  abizenak: string;
  data: Data;
}

@Injectable({
  providedIn: 'root',
})
export class LangileakService {
  private apiUrl = 'http://localhost:8080/api/langileak';

  constructor(private http: HttpClient) {}

  getAllLangileak(): Observable<Langileak[]> {
    return this.http.get<Langileak[]>(this.apiUrl);
  }
}
