import { IData } from "./IData";

export interface IEProduktuak {
    id: number | null;
    izena: string;
    deskribapena: string | null;
    kategoriak: {  
      id: number | null;
      izena: string;
      data: IData;
    };
    marka: string;
    stock: number | null;
    stock_alerta: number | null;
    data: IData;
  }
  