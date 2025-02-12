import { Time } from '@angular/common';
import { IData } from "./IData"

export  interface IOrdutegi{
    id: number |null,
    kodea: string,
    eguna: number |null,
    hasiera_data: Date | null |string,
    amaiera_data : Date |null|string,
    denbora:{
        hasiera_ordua : Time |null ,
        amaiera_ordua : Time | null,
    }
    data: IData
}