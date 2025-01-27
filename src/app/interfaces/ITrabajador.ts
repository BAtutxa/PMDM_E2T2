import { IData } from "./IData";

export  interface ITrabajador{
    kodea: string;
    id: number |null,
    izena: string,
    abizenak : string,
    data: IData,
}