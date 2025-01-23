import { IData } from "./IData";

export interface IBezero {
    id: number |null;
	izena: string;
	abizena: string;
	telefonoa: number |null;
    azal_sentikorra: string;
    data: IData;
}
