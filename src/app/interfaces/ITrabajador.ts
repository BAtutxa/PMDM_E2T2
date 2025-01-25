import { IData } from "./IData";

export  interface ITrabajador{
    kode: string;
    taldeak: any;
    id: number |null,
    izena: string,
    kodea : string,
    abizenak : string,
    data: IData,
}