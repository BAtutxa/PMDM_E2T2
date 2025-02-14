import { IData } from "./IData";

export interface IPM {
        id: number |null;                       
        produktuak: number;              
        kantitatea: number | null;                
        data: IData
        langilea: number;                  
        data_Zutabea: Date;            
}