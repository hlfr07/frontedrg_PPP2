const axios = require("axios");

class listaperfilesController {
    async showlistaPerfiles(req, res) {
        // Acceder a los tokens desde la sesión
    const token = req.session.token;
    const refreshToken = req.session.refreshToken;
    const permisousuario=[];
    const nombre =[];


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
    // Realizar otra petición GET para obtener la lista de usuarios
    let perfiles = [];
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
      perfiles.push(response.data);
      
    } catch (error) {
      console.error("Error al obtener perfiles:", error.response ? error.response.data : error.message);
      res.status(500).send("Error al obtener perfiles");
    }

      //console.log("Perfiles:", permisousuario[0].perfiles);
    // Mostrar los tokens en la consola
    // console.log("Token:", token);
    // console.log("Refresh Token:", refreshToken);
    const ruta = req.originalUrl;
      res.render('perfiles/perfil_lista', {nombre:permisousuario[0].usuario.nombre, apellido:permisousuario[0].usuario.apellido, perfiles:permisousuario[0].perfiles, ruta, token, perfilespost: perfilespost, apiurl: global.apiUrl});
    }
  }
  module.exports = new listaperfilesController();