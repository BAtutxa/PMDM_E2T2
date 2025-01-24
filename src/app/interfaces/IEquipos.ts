import { IData } from "./IData";
import { ITrabajador } from "./ITrabajador";

export interface IEquipos{
    kodea: number,
    izena : string | null,
    data: IData
    langileak: ITrabajador[]
}