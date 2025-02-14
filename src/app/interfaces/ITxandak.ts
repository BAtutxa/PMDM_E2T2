import { IData } from './IData';
import { ITrabajador } from './ITrabajador';
export interface Itxandak {
  id: number | null;             
  mota: string | null;                  
  data: Date  |null
  langileak: ITrabajador       
  dataSimple: IData;                
}
