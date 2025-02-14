import { IData } from "./IData"
import { IEMaterialak } from "./IEMaterialak"
import { ITrabajador } from "./ITrabajador"

export interface IMaileguak {
    id: number |null,
    materiala_id: number,
    idLangilea: number,
    kodea:  number | null
    data: IData
    hasieraData: Date | null
    amaieraData:  Date | null
}