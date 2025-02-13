import { IData } from "./IData"

export  interface IOrdutegi{
    id: number |null,
    kodea: string,
    eguna: number,
    hasiera_data: Date | null |string,
    amaiera_data : Date |null|string,
    denbora:{
        hasiera_ordua : string |null ,
        amaiera_ordua : string | null,
    }
    data: IData
}   