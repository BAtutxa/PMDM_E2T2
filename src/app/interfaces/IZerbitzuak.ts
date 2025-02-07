import { IData } from './IData';
export interface IZerbitzuak {
  id: number | null;             
  izena: string;                  
  etxeko_prezioa: number |null;         
  kanpoko_prezioa: number |null;        
  data: IData;                
}
