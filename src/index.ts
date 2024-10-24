import { USER_ARBA, PASSWORD_ARBA } from '../utils/config'
import axios from 'axios'
import express from 'express'
import { create } from 'xmlbuilder'
import { createHash } from 'crypto'
import { unlinkSync, writeFileSync } from 'fs'
import { parseStringPromise as parseXml } from 'xml2js'
import { ComprobanteResponse } from './types/comprobante'
const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000

const API_URL = 'https://dfe.arba.gov.ar/DomicilioElectronico/SeguridadCliente/dfeServicioConsulta.do'
const user = USER_ARBA || ''
const password = PASSWORD_ARBA || ''

const fileName = 'DFEServicioConsulta'

// El formato de fecha es AAAAMMDD
app.get('/', (req, res) => {
    const { fechaDesde, fechaHasta, cuit } = req.query
    if (!fechaDesde || !fechaHasta || !cuit) {
        res.status(400).send('Faltan datos')
        return
    }
    if (typeof fechaDesde !== 'string' || typeof fechaHasta !== 'string' || typeof cuit !== 'string') {
        res.status(400).send('Se deben enviar los datos en formato string')
        return
    }
    const xmlString = createXml(fechaDesde, fechaHasta, cuit)

    // Calcular el hash MD5 del contenido del XML
    const hash = createHash('md5').update(xmlString).digest('hex');
    const _fileName = `${fileName}_${hash}.xml`;

    // Escribir el XML en el archivo
    writeFileSync(_fileName, xmlString);

    const { formData, config } = createFormData(user, password, xmlString, _fileName);

    console.log(`Archivo generado: ${_fileName}`);

    axios.post(API_URL, formData, config).then((response) => {
        unlinkSync(_fileName)
        // Convertir la respuesta XML a JSON
        parseXml(response.data, {
            explicitArray: false,
            ignoreAttrs: true,
        })
            .then((resp: ComprobanteResponse) => {
                const { COMPROBANTE } = resp
                res.status(200).send(COMPROBANTE)
            })
            .catch(parseError => {
                console.error('Error al parsear XML a JSON:', parseError);
                res.status(500).send('Error al procesar la respuesta');
            });
    })
        .catch(error => {
            console.error(`Error al realizar la solicitud del archivo: ${_fileName}`, error)
            res.status(500).send('Error al realizar la solicitud')
        });
})

function createXml(fechaDesde: string, fechaHasta: string, cuit: string) {
    const consultaAlicuota = create('CONSULTA-ALICUOTA')
    consultaAlicuota.ele('fechaDesde', fechaDesde)
    consultaAlicuota.ele('fechaHasta', fechaHasta)
    consultaAlicuota.ele('cantidadContribuyentes', 1)
    const contribuyentes = consultaAlicuota.ele('contribuyentes', { class: 'list' })
    const contribuyente1 = contribuyentes.ele('contribuyente')
    contribuyente1.ele('cuitContribuyente', cuit)
    return consultaAlicuota.end({ pretty: true })
}

function createFormData(user: string, password: string, xmlString: string, fileName: string) {
    const formData = new FormData()
    const xmlBlob = new Blob([xmlString], { type: 'application/xml' })
    formData.append('user', user || '')
    formData.append('password', password || '')
    formData.append('file', xmlBlob, fileName)
    return {
        formData,
        config: {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    };
};

app.listen(PORT)