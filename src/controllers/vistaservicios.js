const axios = require("axios");

class VistaServiciosController {

  async showServicios(req, res) {
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
    res.render('servicios/servicios', { nombre: permisousuario[0].usuario.nombre, apellido: permisousuario[0].usuario.apellido, perfiles: permisousuario[0].perfiles, token, apiurl: global.apiUrl, ruta });
  }

  async showListaServicios(req, res) {
    // Acceder a los tokens desde la sesión
    const token = req.session.token;
    const permisousuario = [];
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
      console.error("Error al obtener :", error.message);
    }

    //HAREMOS AHORA UNA PETICION A LA API SERVICIOS PARA OBTENER LOS SERVICIOS
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

    //AHORA VAMOS A FILTRAR LOS SERVICIOS QUE TIENE ESTADO EN TRUE
    const serviciosactivos = servicios[0].filter(servicio => servicio.estado === true);

    //HAREMOS UNA PETICION A LA API SERVICIO CAMPOS PARA OBTENER LOS CAMPOS DE LOS SERVICIOS
    const campos = [];

    try {
      const response = await axios.get(`${global.apiUrl}/servicio-campos`, {
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

    // Filtrar campos activos
    const camposactivos = campos[0].filter(campo => campo.estado === true);

    console.log(serviciosactivos);
    const ruta = req.originalUrl;
    res.render('servicios/listaservicios', { nombre: permisousuario[0].usuario.nombre, apellido: permisousuario[0].usuario.apellido, perfiles: permisousuario[0].perfiles, token, apiurl: global.apiUrl, ruta, servicios: serviciosactivos, campos: camposactivos });
  }
}
module.exports = new VistaServiciosController();