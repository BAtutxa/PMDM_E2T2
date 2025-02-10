import { Time } from "@angular/common"
import { IZerbitzuak } from "./IZerbitzuak"
import { IData } from "./IData"

export interface ITicket{
    id: number |null
    zerbitzuak: IZerbitzuak
        hitzorduak: {
            id: number
            eserlekua: number 
            id_langilea: number,
            data: Date
            hasiera_ordua: Time
            amaiera_ordua: Time
            hasiera_ordua_erreala: null |Time,
            amaiera_ordua_erreala: null |Time,
            izena: string,
            telefonoa: string,
            deskribapena: "Algo",
            etxekoa: "E",
            prezio_totala: 12.00,
            dataSimple: IData
        },
        data: IData,
        prezioa: number
    }