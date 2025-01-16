export interface IEProduktuak {
    data: any;
    id: number;
    izena: string;
    deskribapena: string;
    kategoriak: {  
      id: number;
      izena: string;
      data: any;
    };
    marka: string;
    stock: number;
    stock_alerta: number;
    sortze_data: Date;
    eguneratze_data: Date;
    ezabatze_data: Date;
  }
  