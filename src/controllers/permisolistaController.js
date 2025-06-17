const axios = require("axios");

class permisolistaController {
    async showPermisoslista(req, res) {
        // Acceder a los tokens desde la sesión
    const token = req.session.token;
    const refreshToken = req.session.refreshToken;
    const permisousuario=[];
    const nombre =[];
    const permisospost=[];
    const permisosfiltrados=[];

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
    
    try {
        
        const responsepermisos = await axios.get(`${global.apiUrl}/permisos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        permisospost.push(responsepermisos.data); // Guardamos la respuesta de los usuarios        
      } catch (error) {
        console.error("Error al obtener permisos:", error.response ? error.response.data : error.message);
        res.status(500).send("Error al obtener perfiles");
      }

      let modulosfiltrados=[];
      let modulospost=[];
      try {
        
        const responsemodulos = await axios.get(`${global.apiUrl}/modulos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        modulosfiltrados=responsemodulos.data.filter(modulos => modulos.estado == true);
        modulospost = modulosfiltrados; // Guardamos la respuesta de los usuarios
        
        
      } catch (error) {
        console.error("Error al obtener modulos:", error.response ? error.response.data : error.message);
        res.status(500).send("Error al obtener modulos");
      }

      let tablafiltrados=[];
      let tablapost=[];
      try {
        
        const responsetabla = await axios.get(`${global.apiUrl}/tablas`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        tablafiltrados=responsetabla.data.filter(tabla => tabla.estado == true);
        tablapost = tablafiltrados; // Guardamos la respuesta de los usuarios
        
        
      } catch (error) {
        console.error("Error al obtener tablas:", error.response ? error.response.data : error.message);
        res.status(500).send("Error al obtener tablas");
      }

      let perfilespost = [];
      let perfilesfiltrados = []; 
      try {
        
        const response = await axios.get(`${global.apiUrl}/perfiles`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        perfilesfiltrados=response.data.filter(perfil => perfil.estado == true);
        perfilespost = perfilesfiltrados; // Guardamos la respuesta de los usuarios

      } catch (error) {
        console.error("Error al obtener perfiles:", error.response ? error.response.data : error.message);
        res.status(500).send("Error al obtener perfiles");
      }
      //console.log("Perfiles:", permisousuario[0].perfiles);
    // Mostrar los tokens en la consola
    // console.log("Token:", token);
    // console.log("Refresh Token:", refreshToken);
    const ruta = req.originalUrl;
      res.render('permisos/permisoslista', {nombre:permisousuario[0].usuario.nombre, apellido:permisousuario[0].usuario.apellido, perfiles:permisousuario[0].perfiles, token, permisospost:permisospost[0], modulospost: modulospost, tablapost: tablapost, perfilespost: perfilespost, ruta, apiurl: global.apiUrl});
    }
  }
  module.exports = new permisolistaController();