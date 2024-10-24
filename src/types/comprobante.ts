export interface ComprobanteResponse {
    COMPROBANTE: Comprobante
}


export interface Comprobante {
    numeroComprobante: string
    fechaDesde: string
    fechaHasta: string
    cantidadContribuyentes: string
    contribuyentes: Contribuyente[]
}

export interface Contribuyente {
    cuitContribuyente: string
    alicuotaPercepcion: string
    alicuotaRetencion: string
    grupoPercepcion: string
    grupoRetencion: string
}