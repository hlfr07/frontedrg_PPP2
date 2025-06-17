const axios = require("axios");

class RecucontraController {
    async showRecucontra(req, res) {
        const ruta = req.originalUrl;
      res.render('auth/recu_contra', { ruta });
    }
  }
  module.exports = new RecucontraController();

  