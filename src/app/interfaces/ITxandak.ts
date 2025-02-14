import { IData } from './IData';
import { ITrabajador } from './ITrabajador';
export interface Itxandak {
  id: number | null;             
  mota: string;                  
  dataSimple: Date  |null
  langilea: ITrabajador       
  data: IData;                
}
