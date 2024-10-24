# ARBA Alicuota API

Esta es una API desarrollada en Node.js y Express que permite obtener las alícuotas de ARBA mediante la consulta de un CUIT. La API genera un archivo XML con los datos requeridos, lo envía al servicio de ARBA y procesa la respuesta XML convirtiéndola a JSON.

## Requisitos

- Node.js >= 16.x
- npm
- API de ARBA para consultas de alícuotas
- Credenciales de ARBA (usuario y contraseña) para acceder a los servicios

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/lautaroroldan/arbaAPI.git
   cd arbaAPI
2. Instalar las dependencias:
   ```bash
   npm install
## Uso
1. Ejecuta la aplicación en modo de desarrollo:
    ```bash
    npm run dev
    
Esto iniciará un servidor Express en el puerto 3000 (o el puerto configurado en la variable de entorno PORT).

2. Realiza una consulta HTTP GET a la API:
   ```bash
   GET http://localhost:3000/?fechaDesde=AAAA-MM-DD&fechaHasta=AAAA-MM-DD&cuit=XXXXXXXXXXX
fechaDesde: Fecha de inicio de la consulta (formato AAAAMMDD)
fechaHasta: Fecha de fin de la consulta (formato AAAAMMDD)
cuit: CUIT del contribuyente que deseas consultar

3. La API generará un archivo XML, lo enviará al servicio de ARBA y devolverá la respuesta JSON correspondiente con los detalles de la alícuota.
