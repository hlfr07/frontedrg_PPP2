const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const misionController = require("../controllers/misionController");
const visionController = require("../controllers/visionController");
const loginController = require("../controllers/loginController");
const axios = require("axios");
const principalController = require("../controllers/principalController");
const authGuard = require("../middleware/authGuard");
const jwt = require("jsonwebtoken");
const usuarioController = require("../controllers/usuarioController");
const perfilesController = require("../controllers/perfilesController");
const recu_contraController = require("../controllers/recu_contraController");
const usuariolistaController = require("../controllers/usuariolistaController");
const usuariobuscarController = require("../controllers/usuariobuscarController");
const usuarioactualizarController = require("../controllers/usuarioactualizarController");
const permisosController = require("../controllers/permisosController");
const listaperfilesController = require("../controllers/listaperfilesController");
const permisolistaController = require("../controllers/permisolistaController");
const vistaactividades = require("../controllers/vistaactividades");
const vistaservicios = require("../controllers/vistaservicios");
const vistaclientes = require("../controllers/vistaclientes");

router.get("/", (req, res) => indexController.showHome(req, res));
router.get("/mision", (req, res) => misionController.showHome(req, res));
router.get("/vision", (req, res) => visionController.showHome(req, res));
router.get("/login", (req, res) => loginController.showLogin(req, res));
router.get("/principal", authGuard(['cajero', 'admin']), (req, res) => principalController.showPrincipal(req, res));
router.get("/usuarios", authGuard(['admin']), (req, res) => usuarioController.showUsuarios(req, res));
router.get("/perfiles", authGuard(['admin']), (req, res) => perfilesController.showPerfiles(req, res));
router.get("/recuperacion", (req, res) => recu_contraController.showRecucontra(req, res));
router.get("/usuariolista", authGuard(['admin']), (req, res) => usuariolistaController.showUsuarioslista(req, res));
router.get("/usuariobuscar", authGuard(['admin']), (req, res) => usuariobuscarController.showUsuariosbuscar(req, res));
router.get("/usuarioactualizar", authGuard(['admin']), (req, res) => usuarioactualizarController.showUsuariosactualizar(req, res));
router.get("/permisos", authGuard(['admin']), (req, res) => permisosController.showPermisos(req, res));
router.get("/perfilista", authGuard(['admin']), (req, res) => listaperfilesController.showlistaPerfiles(req, res));
router.get("/permisoslista", authGuard(['admin']), (req, res) => permisolistaController.showPermisoslista(req, res));
router.get("/actividades", authGuard(['admin']), (req, res) => vistaactividades.showActivi(req, res));
router.get("/listaactividades", authGuard(['admin']), (req, res) => vistaactividades.showListaActivi(req, res));
router.get("/servicios", authGuard(['admin']), (req, res) => vistaservicios.showServicios(req, res));
router.get("/listaservicios", authGuard(['admin']), (req, res) => vistaservicios.showListaServicios(req, res));
router.get("/clientes", authGuard(['admin']), (req, res) => vistaclientes.showClientes(req, res));
//se crea un metodo post para subir todos los datos de los clientes desde un archivo excel
router.post("/clientes", authGuard(['admin']), (req, res) => vistaclientes.postClientes(req, res));
router.get("/listaclientes", authGuard(['admin']), (req, res) => vistaclientes.showListaclientes(req, res));


router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;
  try {
    // Enviar solicitud POST a la API de autenticación
    const response = await axios.post(`${global.apiUrl}/auth`, {
      usuario,
      password,
    });

    // Verifica que se obtuvieron los tokens
    const { token, refreshToken } = response.data;

    //desencriptamos el token con el metodo jwt.verify
    const decoded = jwt.decode(token);
    //mostramos lo que tiene el token
    //console.log(decoded);


    // Guardar los tokens en la sesión
    req.session.idusuario = decoded.sub;
    req.session.perfiles = decoded.perfiles;
    req.session.token = token;
    req.session.refreshToken = refreshToken;

    //console.log(decoded.sub);
    res.json({ message: "Login exitoso", token, refreshToken });
  } catch (error) {
    console.error("Error en la autenticación:", error.message);
    res.status(500).json({ message: error.response.data.message });
  }
});
//creamos un metodo post para destruir la sesion
router.post("/logout", (req, res) => {
  // Destruir la sesión
  req.session.destroy();
  res.json({ message: "Sesión cerrada" });
});
module.exports = router;
