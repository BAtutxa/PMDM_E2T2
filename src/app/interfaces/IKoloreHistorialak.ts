import { IData } from './IData';

export interface IKoloreHistorialak {
    id: number;
    bezero: number;
    produktu_id: number;
    data: Date | null;
    kantitatea: number |null;
    bolumena: string | null;
    oharrak: string | null;
    dataSimple: IData;
}
