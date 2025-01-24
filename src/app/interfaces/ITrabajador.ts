import { IData } from "./IData";

export  interface ITrabajador{
    id: number |null,
    izena: string,
    kodea : number,
    abizenak : string,
    data: IData,
}