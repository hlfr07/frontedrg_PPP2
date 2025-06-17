const axios = require("axios");

class UsuariolistaController {
    async showUsuarioslista(req, res) {
        // Acceder a los tokens desde la sesión
    const token = req.session.token;
    const refreshToken = req.session.refreshToken;
    const permisousuario=[];
    const nombre =[];
    const perfiles=[];


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
    let usuarios = [];
    let usuariosfiltrados = [];
    let perfilespost = [];
    let perfilesfiltrados = []; 
    try {
      // Solicitud GET para obtener los usuarios
      const responseUsuarios = await axios.get(`${global.apiUrl}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}` // Incluir token si es necesario
        }
      });
      usuariosfiltrados=responseUsuarios.data.filter(usuario => usuario.estado == true);
      usuarios = usuariosfiltrados; // Guardamos la respuesta de los usuarios
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error.message);
    }
    
    let detallesperfiles = [];
    try {
      // Solicitud GET para obtener los usuarios
      const responsedetalle = await axios.get(`${global.apiUrl}/detalle-perfiles`, {
        headers: {
          Authorization: `Bearer ${token}` // Incluir token si es necesario
        }
      });
      detallesperfiles = responsedetalle.data; // Guardamos la respuesta de los usuarios
    } catch (error) {
      console.error("Error al obtener la lista de usuarios:", error.message);
    }

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
      res.render('usuarios/usuariolista', {nombre:permisousuario[0].usuario.nombre, apellido:permisousuario[0].usuario.apellido, perfiles:permisousuario[0].perfiles, ruta, token, usuarios: usuarios, detallesperfiles:detallesperfiles, perfilespost:perfiles[0], perfilespost: perfilespost, apiurl: global.apiUrl});
    }
  }
  module.exports = new UsuariolistaController();