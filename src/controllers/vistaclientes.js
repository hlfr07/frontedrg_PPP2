const axios = require('axios');
const multer = require('multer');
const XlsxStreamReader = require('xlsx-stream-reader');
const path = require('path');
const fs = require('fs');


const upload = multer({ dest: 'uploads/' });

class VistaClientesController {
    async showClientes(req, res) {
        // Acceder a los tokens desde la sesión
        const token = req.session.token;
        const permisousuario = [];

        //hacer una peticion a la api para obtener los perfiles asle con try catch
        try {
            // Enviar solicitud GET a la API de autenticación
            const response = await axios.get(`${global.apiUrl}/usuarios/buscarpermisos/${req.session.idusuario}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Verifica que se obtuvieron los perfiles      
            //console.log(response.data);
            permisousuario.push(response.data);
            // Guardar los perfiles en la sesión
        }
        catch (error) {
            console.error("Error al obtener :", error.message);
        }
        const ruta = req.originalUrl;
        res.render('clientes/clientes', { nombre: permisousuario[0].usuario.nombre, apellido: permisousuario[0].usuario.apellido, perfiles: permisousuario[0].perfiles, token, apiurl: global.apiUrl, ruta });
    }

    postClientes(req, res) {
        upload.single('excelFile')(req, res, async (err) => {
            if (!req.file || !req.body.headerRow) {
                return res.status(400).json({ error: 'Se requiere un archivo Excel y el número de fila de encabezados' });
            }
    
            const headerRowNum = parseInt(req.body.headerRow);
            const BATCH_SIZE = 10;
            const API_URL = global.apiUrl + '/clientes/subirexcel';
            const TOKEN = req.session.token;
    
            const requiredHeaders = [
                'cod_contrato', 'nombres', 'direccion', 'domicilio_legal',
                'dni', 'ruc', 'telefono', 'email', 'nacimiento', 'ubigeo'
            ];
    
            let responseSent = false; // Variable para controlar si ya se envió una respuesta
    
            try {
                const workBookReader = new XlsxStreamReader();
                const fileStream = fs.createReadStream(req.file.path);
    
                let headers = [];
                let currentRow = 0;
                let batchData = [];
                let totalRows = 0;
                let batchCount = 0;
    
                const pendingBatches = []; // Cola para almacenar promesas de envío de lotes
    
                const sendBatch = async (batch) => {
                    try {
                        const response = await axios.post(API_URL, batch, {
                            headers: {
                                Authorization: `Bearer ${TOKEN}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        console.log(`✔️ Lote enviado con éxito:`, batch);
                        console.log(`✔️ Respuesta de la API:`, response.data);
                    } catch (error) {
                        console.error(`❌ Error al enviar el lote a la API:`, error.response?.data || error.message);
                        if (!responseSent) {
                            responseSent = true; // Evitar respuestas duplicadas
                            return res.status(500).json({ error: 'Error al enviar datos a la API' });
                        }
                    }
                };
    
                workBookReader.on('worksheet', function (workSheetReader) {
                    workSheetReader.on('row', function (row) {
                        currentRow++;
    
                        // Validar los encabezados
                        if (currentRow === headerRowNum) {
                            headers = row.values.map((value, index) => value ? value.toString().trim() : `Columna_${index}`);
    
                            console.log('\n📋 Encabezados encontrados:', headers);
    
                            // Validar si los encabezados son correctos
                            const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
                            if (missingHeaders.length > 0) {
                                if (!responseSent) {
                                    responseSent = true;
                                    return res.status(400).json({
                                        error: `Faltan los siguientes encabezados: ${missingHeaders.join(', ')}`
                                    });
                                }
                            }
                        } else if (currentRow > headerRowNum) {
                            const rowData = {};
                            headers.forEach((header, index) => {
                                rowData[header] = row.values[index] || null;
                            });
    
                            if (Object.keys(rowData).length > 0) {
                                batchData.push(rowData);
                                totalRows++;
    
                                if (batchData.length === BATCH_SIZE) {
                                    batchCount++;
                                    console.log(`\n📦 Lote #${batchCount} procesado.`);
                                    pendingBatches.push(sendBatch([...batchData])); // Enviar lote
                                    batchData = [];
                                }
                            }
                        }
                    });
    
                    workSheetReader.on('end', async function () {
                        if (batchData.length > 0) {
                            batchCount++;
                            console.log(`\n📦 Último Lote #${batchCount} procesado.`);
                            pendingBatches.push(sendBatch([...batchData]));
                        }
    
                        console.log(`\n🔄 Esperando que todos los lotes se procesen...`);
                        const results = await Promise.all(pendingBatches); // Esperar que se procesen todos los lotes
    
                        // Verificar si hay algún error en los resultados
                        const error = results.find(result => result && result.error);
                        if (error && !responseSent) {
                            responseSent = true;
                            console.log('❌ Error encontrado al procesar los lotes');
                            return res.status(500).json({ error: 'Hubo un error al procesar los datos' });
                        }
    
                        console.log(`\n✅ Procesamiento completado.`);
                        console.log(`📊 Total de filas procesadas: ${totalRows}`);
                        console.log(`📦 Total de lotes procesados: ${batchCount}`);
    
                        fs.unlinkSync(req.file.path);
                        if (!responseSent) {
                            res.json({
                                message: 'Procesamiento completado',
                                totalRows,
                                totalBatches: batchCount
                            });
                        }
                    });
    
                    workSheetReader.process();
                });
    
                workBookReader.on('error', function (error) {
                    console.error('Error al leer el archivo:', error);
                    fs.unlinkSync(req.file.path);
                    if (!responseSent) {
                        res.status(500).json({ error: 'Error al procesar el archivo' });
                    }
                });
    
                fileStream.pipe(workBookReader);
            } catch (error) {
                console.error('Error:', error);
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                if (!responseSent) {
                    res.status(500).json({ error: 'Error al procesar el archivo' });
                }
            }
        });
    }

    async showListaclientes(req, res) {
        // Acceder a los tokens desde la sesión
        const token = req.session.token;
        const permisousuario = [];
        const clientes = [];
        //hacer una peticion a la api para obtener los perfiles asle con try catch
        try {
          // Enviar solicitud GET a la API de autenticación
          const response = await axios.get(`${global.apiUrl}/usuarios/buscarpermisos/${req.session.idusuario}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          // Verifica que se obtuvieron los perfiles      
          //console.log(response.data);
          permisousuario.push(response.data);
          // Guardar los perfiles en la sesión
        }
        catch (error) {
          console.error("Error al obtener :", error.message);
        }
    
        //HAREMOS AHORA UNA PETICION A LA API SERVICIOS PARA OBTENER LOS SERVICIOS
        // try {
        //   const response = await axios.get(`${global.apiUrl}/clientes`, {
        //     headers: {
        //       Authorization: `Bearer ${token}`
        //     }
        //   });
    
        //   servicios.push(response.data); // Guardamos la respuesta de los servicios
        // } catch (error) {
        //   console.error("Error al obtener servicios:", error.response ? error.response.data : error.message);
        //   res.status(500).send("Error al obtener servicios");
        // }
    
        // //AHORA VAMOS A FILTRAR LOS SERVICIOS QUE TIENE ESTADO EN TRUE
        // const clientesactivos = servicios[0].filter(servicio => servicio.estado === true);
    
        //HAREMOS UNA PETICION A LA API SERVICIO CAMPOS PARA OBTENER LOS CAMPOS DE LOS SERVICIOS
    
        try {
          const response = await axios.get(`${global.apiUrl}/clientes`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          campos.push(response.data); // Si todo bien, guardamos los datos
    
        } catch (error) {
          console.log(token);
          const msg = error.response?.data?.message || error.message;
          console.error("Error al obtener campos:", msg);
          return res.status(403).send("No tienes permiso para acceder a los campos.");
        }
    
        // Verificación segura antes de aplicar .filter
        if (!Array.isArray(campos[0])) {
          return res.status(500).send("Los campos recibidos no tienen el formato esperado.");
        }
    
        console.log(serviciosactivos);
        const ruta = req.originalUrl;
        res.render('clientes/listaclientes', { nombre: permisousuario[0].usuario.nombre, apellido: permisousuario[0].usuario.apellido, perfiles: permisousuario[0].perfiles, token, apiurl: global.apiUrl, ruta, clientes: clientes });
      }
    
}

module.exports = new VistaClientesController();