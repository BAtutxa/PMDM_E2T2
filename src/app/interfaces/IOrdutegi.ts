import { ITime } from "./ITime"
import { IData } from "./IData"

export  interface IOrdutegi{
    id: number |null,
    kodea: string,
    eguna: number |null,
    hasiera_data: Date | null |string,
    amaiera_data : Date |null|string,
    denbora:{
        hasiera_ordua : ITime |null ,
        amaiera_ordua : ITime | null,
    }
    data: IData
}