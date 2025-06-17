
const axios = require("axios");
class VistaactividadesController {

    async showActivi(req, res) {
        // Acceder a los tokens desde la sesión
        const token = req.session.token;
        const refreshToken = req.session.refreshToken;
        const permisousuario = [];
        const nombre = [];
        const usuarios = [];
        const clientes = [];
        const servicios = [];
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
            console.error("Error al obtener los perfiles:", error.message);
        }

        //HAREMOS AHORA UNA PETICION A LA API USUARIOS PARA OBTENER LOS USUARIOS
        try {
            const response = await axios.get(`${global.apiUrl}/usuarios`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            usuarios.push(response.data); // Guardamos la respuesta de los usuarios
        } catch (error) {
            console.error("Error al obtener usuarios:", error.response ? error.response.data : error.message);
            res.status(500).send("Error al obtener usuarios");
        }

        //console.log(usuarios[0]);

        //HAREMOS AHORA UNA PETICION A LA API clientes PARA OBTENER LOS CLIENTES
        try {
            const response = await axios.get(`${global.apiUrl}/clientes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            clientes.push(response.data); // Guardamos la respuesta de los clientes
        } catch (error) {
            console.error("Error al obtener clientes:", error.response ? error.response.data : error.message);
            res.status(500).send("Error al obtener clientes");
        }

        //console.log(clientes[0]);

        //ahora haremos a servicios para obtener los servicios
        try {
            const response = await axios.get(`${global.apiUrl}/servicios`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            servicios.push(response.data); // Guardamos la respuesta de los servicios
        } catch (error) {
            console.error("Error al obtener servicios:", error.response ? error.response.data : error.message);
            res.status(500).send("Error al obtener servicios");
        }

        //console.log("Perfiles:", permisousuario[0].perfiles);
        // Mostrar los tokens en la consola
        // console.log("Token:", token);
        // console.log("Refresh Token:", refreshToken);
        const ruta = req.originalUrl;
        res.render('actividades/actividades', { nombre: permisousuario[0].usuario.nombre, apellido: permisousuario[0].usuario.apellido, perfiles: permisousuario[0].perfiles, ruta, token, usuarios: usuarios[0], clientes: clientes[0], servicios: servicios[0], apiurl: global.apiUrl });
    }

    async showListaActivi(req, res) {
        // Acceder a los tokens desde la sesión
        const token = req.session.token;
        const refreshToken = req.session.refreshToken;
        const permisousuario = [];
        const nombre = [];
        const actividades = [];
        const evidencia = [];
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
            console.error("Error al obtener los perfiles:", error.message);
        }

        //HAREMOS AHORA UNA PETICION A LA API ACTIVIDADES PARA OBTENER LAS ACTIVIDADES
        try {
            const response = await axios.get(`${global.apiUrl}/actividades`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            actividades.push(response.data); // Guardamos la respuesta de las actividades
        } catch (error) {
            console.error("Error al obtener actividades:", error.response ? error.response.data : error.message);
            res.status(500).send("Error al obtener actividades");
        }

        //ahora haremos a evidencia-actividad para obtener las evidencias
        try {
            const response = await axios.get(`${global.apiUrl}/evidencia-actividad`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            evidencia.push(response.data); // Guardamos la respuesta de las evidencias
            console.log(evidencia[0]);
        } catch (error) {
            console.error("Error al obtener evidencias:", error.response ? error.response.data : error.message);
            res.status(500).send("Error al obtener evidencias");
        }


        const ruta = req.originalUrl;
        res.render('actividades/listaactividades', { nombre: permisousuario[0].usuario.nombre, apellido: permisousuario[0].usuario.apellido, perfiles: permisousuario[0].perfiles, ruta, token, actividades: actividades[0], evidencias: evidencia[0], apiurl: global.apiUrl });
    }



}
module.exports = new VistaactividadesController();