import { IData } from "./IData";
import { ITrabajador } from "./ITrabajador";

export interface IEquipos{
    kodea: string,
    izena : string | null,
    data: IData
    langileak: ITrabajador[]
}