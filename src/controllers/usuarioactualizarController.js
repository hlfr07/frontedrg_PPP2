const axios = require("axios");

class UsuarioactualizarController {
    async showUsuariosactualizar(req, res) {
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
  


      //console.log("Perfiles:", permisousuario[0].perfiles);
    // Mostrar los tokens en la consola
    // console.log("Token:", token);
    // console.log("Refresh Token:", refreshToken);
    const ruta = req.originalUrl;
      res.render('usuarios/usuarioactualizar', {nombre:permisousuario[0].usuario.nombre, apellido:permisousuario[0].usuario.apellido, perfiles:permisousuario[0].perfiles, ruta, apiurl: global.apiUrl});
    }
  }
  module.exports = new UsuarioactualizarController();