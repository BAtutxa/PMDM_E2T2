import { IData } from "./IData";

export interface IEProduktuak {
    id: number;
    izena: string;
    deskribapena: string;
    kategoriak: {  
      id: number;
      izena: string;
      data: IData;
    };
    marka: string;
    stock: number;
    stock_alerta: number;
    data: IData;
  }
  